from pydantic import BaseModel


class ResumeMetadata(BaseModel):
    name: str
    email: str
    phone: str
    jobTitle: str
    experienceYears: int
    skills: list[str]