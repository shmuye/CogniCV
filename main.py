from pathlib import Path

from langchain_community.document_loaders import (
    PyMuPDFLoader,
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
)

from langchain_ollama import (
    OllamaEmbeddings,
    ChatOllama,
)

from langchain_chroma import Chroma

from langchain_core.prompts import (
    ChatPromptTemplate,
)

from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain,
)

from langchain_classic.chains.retrieval import (
    create_retrieval_chain,
)

# Initialize embeddings
embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

# Initialize LLM
llm = ChatOllama(
    model="llama3:8b",
    temperature=0,
)

# Prompt template
prompt = ChatPromptTemplate.from_template(
    """
You are a resume analysis assistant.

Answer ONLY using the provided context.

If the answer is not found in the context, say:
"I could not find that information in the document."

Context:
{context}

Question:
{input}

Answer:
"""
)


def load_documents(data_dir="data"):
    """Load PDF documents from data directory"""

    data_path = Path(data_dir)

    if not data_path.exists():
        raise FileNotFoundError(
            f"Data directory '{data_dir}' not found."
        )

    documents = []

    pdf_files = list(data_path.glob("*.pdf"))

    if not pdf_files:
        raise ValueError(
            f"No PDF files found in '{data_dir}'"
        )

    for pdf_file in pdf_files:

        loader = PyMuPDFLoader(str(pdf_file))

        docs = loader.load()

        documents.extend(docs)

    print(f"Loaded {len(documents)} document pages")

    if documents:
        print(
            f"\nSample content:\n"
            f"{documents[0].page_content[:500]}\n"
        )

    return documents


def split_documents(documents):
    """Split documents into chunks"""

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    chunks = splitter.split_documents(documents)

    print(f"Created {len(chunks)} chunks")

    return chunks


def create_vector_store(chunks):
    """Create Chroma vector database"""

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./chroma_db",
    )

    return vector_store


def create_rag_chain(vector_store):
    """Create retrieval chain"""

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    document_chain = create_stuff_documents_chain(
        llm,
        prompt,
    )

    retrieval_chain = create_retrieval_chain(
        retriever,
        document_chain,
    )

    return retrieval_chain


def test_rag_system():
    """Test the RAG system"""

    try:
        # Load documents
        documents = load_documents()

        # Split documents
        chunks = split_documents(documents)

        # Create vector store
        vector_store = create_vector_store(chunks)

        # Create retrieval chain
        rag_chain = create_rag_chain(vector_store)

        # Test queries
        test_queries = [
            "Summarize this document in 3 lines",
            "What skills are mentioned in the resume?",
        ]

        print("\nRAG System Test Results")
        print("=" * 50)

        for i, query in enumerate(test_queries, 1):

            print(f"\nTest {i}: {query}")
            print("-" * 40)

            try:

                result = rag_chain.invoke({
                    "input": query
                })

                print(
                    f"Response:\n{result['answer']}"
                )

                print("\nRetrieved Sources:")

                for j, doc in enumerate(
                    result["context"], 1
                ):

                    print(f"\nSource {j}:")

                    print(
                        doc.page_content[:300]
                    )

                print("\nStatus: SUCCESS")

            except Exception as e:

                print(f"Error: {str(e)}")

                print("Status: FAILED")

            print("-" * 40)

        return True

    except Exception as e:

        print(f"System Error: {str(e)}")

        return False


if __name__ == "__main__":

    print("Starting LangChain RAG Test...")

    success = test_rag_system()

    if success:
        print("\nRAG system is working correctly!")
    else:
        print("\nRAG system test failed.")