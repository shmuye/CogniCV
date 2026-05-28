
# AI Resume Assistant (RAG-Chatbot)

An AI-powered chatbot for resume analysis and Q&A, built with FastAPI (Python backend) and Next.js (React frontend). It leverages Retrieval-Augmented Generation (RAG) to answer questions about uploaded resumes using advanced LLMs and vector search.

---

## Features

- Upload PDF resumes and index them for semantic search
- Ask questions about the uploaded resume and get context-aware answers
- Uses RAG (Retrieval-Augmented Generation) with local vector database (ChromaDB)
- FastAPI backend with streaming responses
- Next.js frontend with real-time chat interface

---

## Project Structure

```
RAG-Chatbot/
├── backend/      # FastAPI backend, RAG logic, vector DB
│   ├── app/
│   ├── chroma_db/
│   ├── data/
│   └── requirements.txt
├── frontend/     # Next.js frontend, chat UI
│   ├── app/
│   ├── components/
│   └── ...
└── README.md
```

---

## Getting Started

### Backend (FastAPI)

1. **Install dependencies:**
	```bash
	cd backend
	python3 -m venv .venv
	source .venv/bin/activate
	pip install -r requirements.txt
	```
2. **Run the server:**
	```bash
	uvicorn app.main:app --reload
	```

### Frontend (Next.js)

1. **Install dependencies:**
	```bash
	cd frontend
	npm install
	```
2. **Run the development server:**
	```bash
	npm run dev
	```

---

## Usage

1. Open the frontend at [http://localhost:3000](http://localhost:3000)
2. Upload a PDF resume using the UI
3. Ask questions about the resume in the chat interface
4. The backend will process, embed, and answer using RAG

---

## Tech Stack

- **Backend:** FastAPI, LangChain, ChromaDB, Ollama LLM, PyMuPDF
- **Frontend:** Next.js, React, Tailwind CSS, Axios

---

## License

MIT License