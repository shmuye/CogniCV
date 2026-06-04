from app.db.database import engine
from app.db.base import Base

from app.models.user import User


def init_db():
    Base.metadata.create_all(
        bind=engine
    )