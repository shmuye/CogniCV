from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
)

from pathlib import Path
import shutil

from app.services.loader import load_pdf
from app.services.splitter import split_docs


from app.services.vector_store import (
    create_vector_store,
)

from app.services.resume_metadata import (
    extract_resume_metadata,
)

router = APIRouter()

UPLOAD_DIR = Path("data")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload(
    conversation_id: str = Form(...),
    file: UploadFile = File(...),
):

    conversation_dir = (
        UPLOAD_DIR / conversation_id
    )

    conversation_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    file_path = (
        conversation_dir / file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Load PDF
    docs = load_pdf(str(file_path))

    resume_text = "\n".join(
        doc.page_content
        for doc in docs
    )

    metadata = extract_resume_metadata(
        resume_text
    )

    # Split
    chunks = split_docs(docs)

    # Create embeddings
    create_vector_store(
        chunks,
        conversation_id,
    )

    return {
        "message":
        "File uploaded and indexed successfully",
        "metadata": metadata,
    }