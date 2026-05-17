from langchain_community.document_loaders import (
    PyMuPDFLoader,
)
from pathlib import Path

def load_pdf(file_path: str):
    loader = PyMuPDFLoader(file_path)
    return loader.load()