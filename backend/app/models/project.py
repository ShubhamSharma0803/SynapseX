from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class ProjectCategory(str, Enum):
    """Project category options"""
    WEB_DEV = "Web Development"
    MOBILE_APP = "Mobile App"
    AI_ML = "AI/ML"
    DATA_SCIENCE = "Data Science"
    DEVOPS = "DevOps"
    DESIGN = "Design"
    BLOCKCHAIN = "Blockchain"
    GAME_DEV = "Game Development"
    OTHER = "Other"

class ProjectPriority(str, Enum):
    """Project priority levels"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ProjectVisibility(str, Enum):
    """Project visibility options"""
    PRIVATE = "Private"
    TEAM_ONLY = "Team Only"
    ORGANIZATION = "Organization"
    PUBLIC = "Public"

class TeamMemberRole(str, Enum):
    """Team member role options"""
    ADMIN = "Admin"
    DEVELOPER = "Developer"
    DESIGNER = "Designer"
    TESTER = "Tester"
    VIEWER = "Viewer"

class TeamMemberInvite(BaseModel):
    """Team member invitation details"""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    github_username: Optional[str] = None
    discord_username: Optional[str] = None
    role: TeamMemberRole = TeamMemberRole.DEVELOPER
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "github_username": "johndoe",
                "discord_username": "johndoe#1234",
                "role": "Developer"
            }
        }

class ProjectCreate(BaseModel):
    """
    Pydantic model for creating a new project.
    
    This model validates the incoming request data when creating a project.
    Note: user_id is automatically extracted from the authenticated user token.
    """
    # Basic Information
    title: str = Field(..., min_length=1, max_length=200, description="Project name")
    description: str = Field(..., min_length=10, description="Project problem statement or description")
    category: ProjectCategory = Field(..., description="Project category/type")
    priority: ProjectPriority = Field(default=ProjectPriority.MEDIUM, description="Project priority level")
    
    # Timeline
    start_date: Optional[date] = Field(None, description="Project start date")
    end_date: Optional[date] = Field(None, description="Expected project end date")
    duration_weeks: Optional[int] = Field(None, ge=1, le=104, description="Expected duration in weeks")
    
    # Team & Collaboration
    leader_name: str = Field(..., min_length=1, max_length=100, description="Project leader name")
    team_members: List[TeamMemberInvite] = Field(default=[], description="List of team members to invite")
    
    # Integration & Tools
    github_repo_url: Optional[str] = Field(None, description="GitHub repository URL")
    discord_server_url: Optional[str] = Field(None, description="Discord server URL")
    slack_workspace_url: Optional[str] = Field(None, description="Slack workspace URL")
    
    # Tech & Preferences
    tech_stack_preferences: List[str] = Field(default=[], description="Preferred technologies")
    tags: List[str] = Field(default=[], max_items=10, description="Project tags/keywords")
    
    # Privacy & Access
    visibility: ProjectVisibility = Field(default=ProjectVisibility.TEAM_ONLY, description="Project visibility")
    
    # File uploads (handled separately via multipart/form-data)
    # file_attachments will be handled in the endpoint
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "SynapseX Platform",
                "description": "An AI-driven project intelligence system that helps teams manage hackathon projects with automated task generation and conflict detection.",
                "category": "Web Development",
                "priority": "High",
                "start_date": "2026-02-01",
                "end_date": "2026-03-31",
                "duration_weeks": 8,
                "leader_name": "John Doe",
                "team_members": [
                    {
                        "name": "Jane Smith",
                        "email": "jane@example.com",
                        "github_username": "janesmith",
                        "role": "Developer"
                    }
                ],
                "github_repo_url": "https://github.com/username/synapsex",
                "tech_stack_preferences": ["React", "FastAPI", "Supabase"],
                "tags": ["hackathon", "AI", "productivity"],
                "visibility": "Team Only"
            }
        }

class ProjectResponse(BaseModel):
    """
    Pydantic model for project response.
    """
    id: int
    title: str
    description: str
    category: str
    priority: str
    leader_name: str
    user_id: str
    team_members: Optional[List[dict]] = None
    ai_summary: Optional[dict] = None
    tasks: Optional[list] = None
    github_repo_url: Optional[str] = None
    tags: Optional[List[str]] = None
    visibility: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True