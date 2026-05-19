from pathlib import Path
import shutil

from langchain_chroma import Chroma

from app.core.rag import embeddings


CHROMA_PATH = "./chroma_db"


def create_vector_store(chunks):

    # Remove old DB
    if Path(CHROMA_PATH).exists():
        shutil.rmtree(CHROMA_PATH)

    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH,
    )