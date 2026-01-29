import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.database import get_supabase_client

# Load environment variables from .env file
load_dotenv()

# Get Gemini API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Validate that API key is present
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY must be set in the .env file")

# Initialize Gemini 1.5 Flash model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.3,  # Lower temperature for more consistent conflict detection
    convert_system_message_to_human=True
)


async def analyze_activity_for_conflicts(new_activity_text: str, project_id: str) -> dict:
    """
    Analyzes a new developer activity to detect potential conflicts with recent activities.
    
    This function acts as a 'conflict radar' by:
    1. Fetching the last 5 activities for the specified project
    2. Sending both the new activity and past activities to Gemini AI
    3. Getting an AI analysis of potential conflicts
    
    Args:
        new_activity_text (str): Description of the new developer activity
        project_id (str): The ID of the project to check activities for
        
    Returns:
        dict: A dictionary containing:
            - 'has_conflict' (bool): Whether a conflict was detected
            - 'verdict' (str): The AI's verdict message
            - 'warning' (str, optional): Detailed warning if conflict detected
            
    Raises:
        Exception: If there's an error fetching activities or analyzing conflicts
    """
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Fetch the last 5 activities for this project
        # Ordered by creation date (most recent first)
        response = supabase.table("activities").select("*").eq(
            "project_id", project_id
        ).order("created_at", desc=True).limit(5).execute()
        
        # Extract past activities data
        past_activities = response.data if response.data else []
        
        # Format past activities into a readable string for the AI
        past_activities_text = ""
        if past_activities:
            past_activities_text = "Recent activities:\n"
            for idx, activity in enumerate(past_activities, 1):
                platform = activity.get("platform", "Unknown")
                content = activity.get("content", {})
                created_at = activity.get("created_at", "Unknown time")
                
                # Extract relevant info from content (adjust based on your data structure)
                activity_summary = json.dumps(content, indent=2) if isinstance(content, dict) else str(content)
                
                past_activities_text += f"\n{idx}. [{platform}] at {created_at}:\n{activity_summary[:200]}...\n"
        else:
            past_activities_text = "No recent activities found for this project."
        
        # Create the system message to set the AI's role as a Conflict Detector
        system_prompt = SystemMessage(content="""
        You are an expert Software Project Manager specializing in detecting conflicts 
        in developer activities. Your job is to identify potential conflicts such as:
        - Multiple developers working on the same file or feature
        - Changes that might overwrite each other's work
        - Contradictory implementation approaches
        - Breaking changes that affect ongoing work
        - Duplicate efforts on similar tasks
        
        Be thorough but not overly cautious. Only flag real potential conflicts.
        """)
        
        # Create the user prompt with the activities to analyze
        user_prompt = HumanMessage(content=f"""
        Analyze this new developer activity for potential conflicts with recent activities.
        
        NEW ACTIVITY:
        {new_activity_text}
        
        {past_activities_text}
        
        Question: Is this new developer activity conflicting with what was done recently?
        
        Respond in the following JSON format:
        {{
            "has_conflict": true or false,
            "verdict": "Your verdict here",
            "warning": "Detailed warning if conflict detected, or empty string if no conflict"
        }}
        
        If there IS a conflict:
        - Set has_conflict to true
        - Provide a clear verdict explaining the conflict
        - Give a detailed warning with actionable advice
        
        If there is NO conflict:
        - Set has_conflict to false
        - Set verdict to "No conflict"
        - Set warning to empty string
        
        Only return the JSON, no additional text.
        """)
        
        # Invoke the LLM with the messages
        response = llm.invoke([system_prompt, user_prompt])
        
        # Extract the content from the response
        content = response.content
        
        # Parse the JSON response
        # Remove markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        result = json.loads(content)
        
        return result
        
    except json.JSONDecodeError as e:
        # Fallback if JSON parsing fails
        return {
            "has_conflict": False,
            "verdict": "Unable to analyze - JSON parsing error",
            "warning": ""
        }
    except Exception as e:
        # Handle any other errors
        raise Exception(f"Error analyzing activity for conflicts: {str(e)}")