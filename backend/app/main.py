from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.api.routes import (
    chat,
    upload,
    health,
    auth,
)

from app.db.init_db import (
    init_db,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


app.include_router(
    chat.router,
    prefix="/chat",
)

app.include_router(
    upload.router,
    prefix="/upload",
)

app.include_router(
    health.router,
    prefix="/health",
)

app.include_router(
    auth.router,
    prefix="/auth",
)