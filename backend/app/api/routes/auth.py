from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.db.dependencies import (
    get_db,
)

from app.models.user import User

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(
    data: AuthRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    user = User(
        email=data.email,
        password=hash_password(
            data.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
        },
    }


@router.post("/login")
def login(
    data: AuthRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == data.email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        data.password,
        user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
        },
    }