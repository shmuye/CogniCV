from pathlib import Path
import shutil

from langchain_chroma import Chroma

from app.core.rag import embeddings


BASE_CHROMA_PATH = "./chroma_db"


def create_vector_store(
    chunks,
    conversation_id: str,
):

    persist_directory = (
        f"{BASE_CHROMA_PATH}/{conversation_id}"
    )

    # Remove old DB for this conversation only
    if Path(persist_directory).exists():
        shutil.rmtree(persist_directory)

    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory,
    )