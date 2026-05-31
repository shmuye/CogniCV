import json

from langchain_ollama import ChatOllama


llm = ChatOllama(
    model="llama3:8b",
    temperature=0,
)


def extract_resume_metadata(
    resume_text: str,
):
    prompt = f"""
Extract resume information.

Return ONLY valid JSON.

{{
  "name": "",
  "email": "",
  "phone": "",
  "jobTitle": "",
  "experienceYears": 0,
  "skills": []
}}

Resume:

{resume_text}
"""

    response = llm.invoke(prompt)

    try:
        return json.loads(response.content)
    except Exception:
        return {
            "name": "",
            "email": "",
            "phone": "",
            "jobTitle": "",
            "experienceYears": 0,
            "skills": [],
        }