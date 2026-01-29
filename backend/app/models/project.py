from pydantic import BaseModel

# This is the "blueprint" for a new project request
class ProjectCreate(BaseModel):
    title: str
    description: str
    leader_name: str