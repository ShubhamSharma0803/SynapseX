from fastapi import APIRouter, HTTPException, Request
from app.database import get_supabase_client
from app.services.conflict_radar import analyze_activity_for_conflicts
from datetime import datetime
import json

# Create API Router for webhooks
router = APIRouter(
    prefix="/webhooks",
    tags=["webhooks"]
)


@router.post("/github")
async def github_webhook(request: Request):
    """
    GitHub webhook endpoint to receive events from GitHub.
    
    This acts as the 'ears' for GitHub activities, capturing all events
    and storing them in the activities table. It also checks for conflicts
    with recent activities using AI.
    
    Args:
        request: The incoming request containing the GitHub webhook payload
        
    Returns:
        dict: Success message with activity ID and conflict detection results
        
    Raises:
        HTTPException: If saving to database fails
    """
    try:
        # Get the raw JSON payload from GitHub
        payload = await request.json()
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Fetch the first project ID from the database (or use a dummy ID)
        # TODO: Replace this with actual project_id from webhook payload or context
        projects_response = supabase.table("projects").select("id").limit(1).execute()
        if projects_response.data and len(projects_response.data) > 0:
            project_id = str(projects_response.data[0]["id"])
        else:
            project_id = "1"  # Fallback dummy ID if no projects exist
        
        # Save the activity to the activities table
        response = supabase.table("activities").insert({
            "platform": "GitHub",
            "content": payload,
            "project_id": project_id,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        # Check if data was inserted successfully
        if response.data:
            activity_id = response.data[0].get("id")
            
            # Create a readable summary of the activity for conflict detection
            activity_summary = f"GitHub activity: {json.dumps(payload)[:200]}"
            
            # Analyze for conflicts using the Conflict Radar
            conflict_result = await analyze_activity_for_conflicts(
                new_activity_text=activity_summary,
                project_id=project_id
            )
            
            # Build the response
            response_data = {
                "status": "success",
                "message": "GitHub webhook received and saved",
                "activity_id": activity_id,
                "conflict_check": {
                    "has_conflict": conflict_result.get("has_conflict", False),
                    "verdict": conflict_result.get("verdict", "No analysis")
                }
            }
            
            # If conflict detected, include the warning in the response
            if conflict_result.get("has_conflict"):
                response_data["conflict_check"]["warning"] = conflict_result.get("warning", "")
                response_data["alert"] = "⚠️ CONFLICT DETECTED - Check conflict_check for details"
            
            return response_data
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save GitHub webhook"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing GitHub webhook: {str(e)}"
        )


@router.post("/discord")
async def discord_webhook(request: Request):
    """
    Discord webhook endpoint to receive events from Discord.
    
    This acts as the 'ears' for Discord activities, capturing all events
    and storing them in the activities table. It also checks for conflicts
    with recent activities using AI.
    
    Args:
        request: The incoming request containing the Discord webhook payload
        
    Returns:
        dict: Success message with activity ID and conflict detection results
        
    Raises:
        HTTPException: If saving to database fails
    """
    try:
        # Get the raw JSON payload from Discord
        payload = await request.json()
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Fetch the first project ID from the database (or use a dummy ID)
        # TODO: Replace this with actual project_id from webhook payload or context
        projects_response = supabase.table("projects").select("id").limit(1).execute()
        if projects_response.data and len(projects_response.data) > 0:
            project_id = str(projects_response.data[0]["id"])
        else:
            project_id = "1"  # Fallback dummy ID if no projects exist
        
        # Save the activity to the activities table
        response = supabase.table("activities").insert({
            "platform": "Discord",
            "content": payload,
            "project_id": project_id,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
        
        # Check if data was inserted successfully
        if response.data:
            activity_id = response.data[0].get("id")
            
            # Create a readable summary of the activity for conflict detection
            activity_summary = f"Discord activity: {json.dumps(payload)[:200]}"
            
            # Analyze for conflicts using the Conflict Radar
            conflict_result = await analyze_activity_for_conflicts(
                new_activity_text=activity_summary,
                project_id=project_id
            )
            
            # Build the response
            response_data = {
                "status": "success",
                "message": "Discord webhook received and saved",
                "activity_id": activity_id,
                "conflict_check": {
                    "has_conflict": conflict_result.get("has_conflict", False),
                    "verdict": conflict_result.get("verdict", "No analysis")
                }
            }
            
            # If conflict detected, include the warning in the response
            if conflict_result.get("has_conflict"):
                response_data["conflict_check"]["warning"] = conflict_result.get("warning", "")
                response_data["alert"] = "⚠️ CONFLICT DETECTED - Check conflict_check for details"
            
            return response_data
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save Discord webhook"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing Discord webhook: {str(e)}"
        )
