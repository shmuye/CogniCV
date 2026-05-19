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


# =========================
# Models
# =========================

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

llm = ChatOllama(
    model="llama3:8b",
    temperature=0,
)


# =========================
# Prompt
# =========================

prompt = ChatPromptTemplate.from_template(
    """
You are a resume analysis assistant.

Answer ONLY using the provided context.

FORMAT RULES:

- Use proper markdown formatting.
- Put each item on a new line.
- Use bullet points when listing skills.
- Use headings when appropriate.
- Add spacing between sections.
- Keep responses clean and readable.

If the answer is not found in the context, say:
"I could not find that information in the document."

Context:
{context}

Question:
{input}

Answer:
"""
)


# =========================
# Globals
# =========================

vector_store = None
rag_chain = None


# =========================
# Load RAG Chain
# =========================

def load_vector_store():

    global vector_store
    global rag_chain

    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings,
    )

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    document_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
    )

    rag_chain = create_retrieval_chain(
        retriever,
        document_chain,
    )


# =========================
# Query
# =========================

def query_rag(question: str):

    global rag_chain

    if rag_chain is None:
        return {
            "answer": "No documents indexed yet.",
            "sources": [],
        }

    result = rag_chain.invoke({
        "input": question
    })

    return {
        "answer": result["answer"],
        "sources": [
            doc.page_content
            for doc in result["context"]
        ]
    }