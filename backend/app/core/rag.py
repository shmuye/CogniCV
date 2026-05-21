from langchain_ollama import (
    OllamaEmbeddings,
    ChatOllama,
)

from langchain_chroma import Chroma

from langchain_core.prompts import (
    ChatPromptTemplate,
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
    streaming=True,
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
{question}

Answer:
"""
)


# =========================
# Globals
# =========================

vector_store = None


# =========================
# Load Vector Store
# =========================

def load_vector_store():

    global vector_store

    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings,
    )


# =========================
# Streaming Query
# =========================

async def query_rag_stream(question: str):

    global vector_store

    if vector_store is None:
        yield "No documents indexed yet."
        return

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    docs = retriever.invoke(question)

    context = "\n\n".join([
        doc.page_content
        for doc in docs
    ])

    final_prompt = prompt.format(
        context=context,
        question=question,
    )

    async for chunk in llm.astream(
        final_prompt
    ):
        yield chunk.content