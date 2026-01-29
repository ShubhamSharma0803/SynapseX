from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_supabase_client
from app.models.project import ProjectCreate
from app.services.ai_services import summarize_project, generate_initial_tasks
from app.api import webhooks
from app.auth import get_current_user

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


@app.get("/projects/")
async def get_all_projects(current_user: dict = Depends(get_current_user)):
    """
    Fetch all projects from the database.
    
    Protected endpoint - requires valid authentication token.
    Returns all projects ordered by creation date (newest first).
    
    Args:
        current_user: Authenticated user object injected by the dependency
    
    Returns:
        list: A list of all project objects ordered by created_at (descending)
        
    Raises:
        HTTPException: If fetching projects fails or user is not authenticated
    """
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Fetch all projects, ordered by newest first
        response = supabase.table("projects").select("*").order(
            "created_at", desc=True
        ).execute()
        
        # Return the projects list (empty list if no projects found)
        if response.data:
            return response.data
        else:
            return []
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching projects: {str(e)}"
        )


@app.post("/projects/")
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new project in the database with AI-generated summary and tasks.
    
    Protected endpoint - requires valid authentication token.
    
    Args:
        project: ProjectCreate model containing title, description, and leader_name
        current_user: Authenticated user object injected by the dependency
        
    Returns:
        dict: The inserted project data including AI-generated summary and tasks
        
    Raises:
        HTTPException: If the insert operation or AI generation fails, or user is not authenticated
    """
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Generate AI summary and initial tasks using the project description
        ai_summary = await summarize_project(project.description)
        ai_tasks = await generate_initial_tasks(project.description)
        
        # Insert project data into the projects table with AI-generated content
        # Note: In future iterations, you can use current_user.email or current_user.id
        # instead of project.leader_name for better security and traceability
        response = supabase.table("projects").insert({
            "title": project.title,
            "description": project.description,
            "leader_name": project.leader_name,
            "ai_summary": ai_summary,
            "tasks": ai_tasks,
            # Future enhancement: "created_by": current_user.id
        }).execute()
        
        # Check if data was inserted successfully
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to create project"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating project: {str(e)}"
        )


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