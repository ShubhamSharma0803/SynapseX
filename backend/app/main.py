from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_supabase_client
from app.models.project import ProjectCreate, TeamMemberInvite
from app.services.ai_services import summarize_project, generate_initial_tasks
from app.api import webhooks
from app.auth import get_current_user
from typing import List, Optional
import json

# Initialize FastAPI app
app = FastAPI(
    title="Aura Intelligence API",
    description="Backend API for Aura Intelligence",
    version="1.0.0"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include webhook router
app.include_router(webhooks.router)


@app.get("/")
async def root():
    """
    Root endpoint to check API status.
    
    Public endpoint - no authentication required.
    
    Returns:
        dict: Status message confirming the API is live
    """
    return {"status": "Aura Intelligence API is Live"}


@app.post("/projects/")
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new project with comprehensive details and AI-generated content.
    
    Protected endpoint - requires valid authentication token.
    Automatically sends invitation emails to team members.
    
    Args:
        project: ProjectCreate model with all project details
        current_user: Authenticated user dict injected by the dependency
        
    Returns:
        dict: The inserted project data including AI-generated summary and tasks
        
    Raises:
        HTTPException: If validation or creation fails
    """
    try:
        # Extract user ID from the authenticated user dictionary
        user_id = current_user.get('id')
        
        # Validate that user_id exists
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="User ID not found in authentication token. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Generate AI summary and initial tasks using the project description
        ai_summary = await summarize_project(project.description)
        ai_tasks = await generate_initial_tasks(project.description)
        
        # Prepare team members data (convert Pydantic models to dicts)
        team_members_data = [member.dict() for member in project.team_members]
        
        # Insert project data into the projects table
        response = supabase.table("projects").insert({
            "title": project.title,
            "description": project.description,
            "category": project.category.value,
            "priority": project.priority.value,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "duration_weeks": project.duration_weeks,
            "leader_name": project.leader_name,
            "user_id": user_id,
            "team_members": team_members_data,
            "github_repo_url": project.github_repo_url,
            "discord_server_url": project.discord_server_url,
            "slack_workspace_url": project.slack_workspace_url,
            "tech_stack_preferences": project.tech_stack_preferences,
            "tags": project.tags,
            "visibility": project.visibility.value,
            "ai_summary": ai_summary,
            "tasks": ai_tasks,
        }).execute()
        
        # Check if data was inserted successfully
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create project"
            )
        
        created_project = response.data[0]
        project_id = created_project.get('id')
        
        # Send invitation emails to team members (async task)
        # This would be implemented as a background task in production
        for member in project.team_members:
            try:
                # TODO: Implement email invitation service
                # await send_team_invitation_email(
                #     member_email=member.email,
                #     member_name=member.name,
                #     project_name=project.title,
                #     project_id=project_id,
                #     inviter_name=project.leader_name
                # )
                pass
            except Exception as e:
                # Log error but don't fail the entire request
                print(f"Failed to send invitation to {member.email}: {str(e)}")
        
        return created_project
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
        
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Error creating project: {str(e)}"
        )

# Optional: Endpoint for file uploads
@app.post("/projects/{project_id}/upload-files")
async def upload_project_files(
    project_id: int,
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload files/documents for a project.
    
    Args:
        project_id: The ID of the project
        files: List of files to upload
        current_user: Authenticated user
        
    Returns:
        dict: Upload status and file URLs
    """
    try:
        user_id = current_user.get('id')
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        supabase = get_supabase_client()
        
        # Verify project ownership
        project = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).single().execute()
        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found or unauthorized")
        
        uploaded_files = []
        
        for file in files:
            # Read file content
            content = await file.read()
            
            # Upload to Supabase Storage
            file_path = f"{user_id}/{project_id}/{file.filename}"
            storage_response = supabase.storage.from_("project-files").upload(
                file_path,
                content,
                {"content-type": file.content_type}
            )
            
            # Get public URL
            file_url = supabase.storage.from_("project-files").get_public_url(file_path)
            
            uploaded_files.append({
                "filename": file.filename,
                "url": file_url,
                "size": len(content),
                "content_type": file.content_type
            })
        
        # Update project with file references
        supabase.table("projects").update({
            "attachments": uploaded_files
        }).eq("id", project_id).execute()
        
        return {
            "status": "success",
            "files": uploaded_files
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@app.get("/projects/{project_id}/activities")
async def get_project_activities(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch the activity timeline for a specific project.
    
    Protected endpoint - requires valid authentication token.
    Returns all activities for the given project, ordered by newest first.
    This allows the frontend to display the project timeline with any AI
    conflict alerts at the top.
    
    Args:
        project_id: The ID of the project to fetch activities for
        current_user: Authenticated user object injected by the dependency
        
    Returns:
        list: A list of activity objects ordered by created_at (descending)
        
    Raises:
        HTTPException: If fetching activities fails or user is not authenticated
    """
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Fetch all activities for this project, ordered by newest first
        response = supabase.table("activities").select("*").eq(
            "project_id", project_id
        ).order("created_at", desc=True).execute()
        
        # Return the activities list (empty list if no activities found)
        if response.data:
            return response.data
        else:
            return []
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching project activities: {str(e)}"
        )