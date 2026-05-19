from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from pathlib import Path

from app.api.routes import (
    chat,
    upload,
    health,
)

from app.core.rag import load_vector_store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




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

@app.on_event("startup")
def startup_event():

    if Path("./chroma_db").exists():
        load_vector_store()