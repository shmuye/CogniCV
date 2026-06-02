from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid

from app.db.fake_db import users_db
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
def signup(data: AuthRequest):
    if data.email in users_db:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    user_id = str(uuid.uuid4())

    users_db[data.email] = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(
            data.password
        ),
    }

    token = create_access_token(
        {"sub": user_id}
    )

    return {
        "access_token": token,
        "user": {
            "id": user_id,
            "email": data.email,
        },
    }


@router.post("/login")
def login(data: AuthRequest):
    user = users_db.get(data.email)

    if not user or not verify_password(
        data.password,
        user["password"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        {"sub": user["id"]}
    )

    return {
        "access_token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
        },
    }