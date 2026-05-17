from langchain_chroma import Chroma
from app.core.rag import embeddings


def create_vector_store(chunks):
    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=".../chroma_db",
    )