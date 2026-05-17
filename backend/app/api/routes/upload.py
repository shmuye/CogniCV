from fastapi import APIRouter, UploadFile, File
import shutil
from pathlib import Path

from app.services.loader import load_pdf
from app.services.splitter import split_docs
from app.services.vector_store import create_vector_store
from app.core.rag import load_vector_store

router = APIRouter()


UPLOAD_DIR = Path("data")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload(file: UploadFile = File(...)):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    docs = load_pdf(str(file_path))
    chunks = split_docs(docs)

    create_vector_store(chunks)

    # reload retriever
    load_vector_store()

    return {"message": "File uploaded and indexed successfully"}