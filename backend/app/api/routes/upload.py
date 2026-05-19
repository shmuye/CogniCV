from fastapi import (
    APIRouter,
    UploadFile,
    File,
)

from pathlib import Path
import shutil

from app.services.loader import load_pdf
from app.services.splitter import split_docs
from app.services.vector_store import (
    create_vector_store,
)

from app.core.rag import load_vector_store

router = APIRouter()

UPLOAD_DIR = Path("data")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload(
    file: UploadFile = File(...)
):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Load PDF
    docs = load_pdf(str(file_path))

    # Split
    chunks = split_docs(docs)

    # Create embeddings
    create_vector_store(chunks)

    # Reload retriever
    load_vector_store()

    return {
        "message":
        "File uploaded and indexed successfully"
    }