from pathlib import Path

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
# Load Conversation Vector Store
# =========================

def load_vector_store(
    conversation_id: str,
):

    persist_directory = (
        f"./chroma_db/{conversation_id}"
    )

    if not Path(
        persist_directory
    ).exists():
        return None

    return Chroma(
        persist_directory=
        persist_directory,
        embedding_function=
        embeddings,
    )


# =========================
# Streaming Query
# =========================

async def query_rag_stream(
    question: str,
    conversation_id: str,
):

    vector_store = load_vector_store(
        conversation_id
    )

    if vector_store is None:
          yield """
I don’t have a resume to analyze yet.

Please upload a PDF resume first, then ask me questions about it.
"""

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

    full_response = ""

    async for chunk in llm.astream(
        final_prompt
    ):
        full_response += chunk.content
        yield full_response