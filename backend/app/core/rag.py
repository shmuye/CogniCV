from langchain_ollama import ollama_embeddings, ChatOllama
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains.retrieval import create_retrieval_chain   


# Models

embeddings = ollama_embeddings(
    model="mxbai-embed-large"
)

llm = ChatOllama(
    model="llama3:8b",
    temperature=0,
)

# Prompt template
prompt = ChatPromptTemplate.from_template("""
You are a resume analysis assistant.

Answer ONLY using the provided context.

If not found, say:
"I could not find that information in the document."

Context:
{context}

Question:
{input}

Answer:
""")

# Global store simple version

vector_store = None
rag_chain = None

def load_vector_store():
    global vector_store, rag_chain

    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings,
    )

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    document_chain = create_stuff_documents_chain(
        llm=llm, 
        prompt=prompt
    )

    rag_chain = create_retrieval_chain(
        retriever,
        document_chain,
    )

def query_rag(question: str):
    
    if rag_chain is None:
        return "No documents indexed yet"
    result = rag_chain.invoke({ "input": question})
    return result["answer"]