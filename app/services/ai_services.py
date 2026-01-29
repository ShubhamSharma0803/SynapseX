import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

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
    temperature=0.7,
    convert_system_message_to_human=True
)


async def summarize_project(description: str) -> dict:
    """
    Summarizes a project description as a Project Manager would.
    
    Takes a raw project description and returns a concise summary with:
    - 3 key bullet points about the project
    - A suggested tech stack
    
    Args:
        description (str): The raw project description from the user
        
    Returns:
        dict: A dictionary containing 'summary_points' (list) and 'tech_stack' (list)
    """
    # Create the system message to set the AI's role as a Project Manager
    system_prompt = SystemMessage(content="""
    You are an experienced Project Manager specializing in tech projects.
    Your job is to analyze project descriptions and provide clear, actionable summaries.
    """)
    
    # Create the user prompt with specific instructions
    user_prompt = HumanMessage(content=f"""
    Analyze this project description and provide:
    1. Exactly 3 concise bullet points summarizing the key aspects of the project
    2. A suggested tech stack (list 3-5 technologies that would be suitable)
    
    Project Description:
    {description}
    
    Respond in the following JSON format:
    {{
        "summary_points": ["point 1", "point 2", "point 3"],
        "tech_stack": ["tech1", "tech2", "tech3", ...]
    }}
    
    Only return the JSON, no additional text.
    """)
    
    try:
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
            "summary_points": [
                "Failed to parse AI response",
                "Please try again with a clearer description",
                "Contact support if this persists"
            ],
            "tech_stack": ["N/A"]
        }
    except Exception as e:
        # Handle any other errors
        raise Exception(f"Error generating project summary: {str(e)}")


async def generate_initial_tasks(description: str) -> list:
    """
    Generates a list of 5 initial tasks for a project team to get started.
    
    Takes a project description and returns actionable tasks that can be
    assigned to team members to kickstart the project.
    
    Args:
        description (str): The project description
        
    Returns:
        list: A list of 5 task dictionaries, each containing 'task_number', 
              'title', and 'description'
    """
    # Create the system message to set the AI's role
    system_prompt = SystemMessage(content="""
    You are an experienced Project Manager who excels at breaking down projects 
    into actionable tasks. You create clear, specific tasks that help teams 
    get started quickly.
    """)
    
    # Create the user prompt with specific instructions
    user_prompt = HumanMessage(content=f"""
    Based on this project description, generate exactly 5 initial tasks that a 
    team should tackle first to get the project started.
    
    Project Description:
    {description}
    
    Each task should be specific and actionable. Respond in the following JSON format:
    [
        {{
            "task_number": 1,
            "title": "Task title",
            "description": "Detailed task description"
        }},
        ...
    ]
    
    Only return the JSON array, no additional text.
    """)
    
    try:
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
        
        # Ensure we have exactly 5 tasks
        if len(result) > 5:
            result = result[:5]
        
        return result
        
    except json.JSONDecodeError as e:
        # Fallback if JSON parsing fails
        return [
            {
                "task_number": i,
                "title": f"Task {i}",
                "description": "Failed to generate task. Please try again."
            }
            for i in range(1, 6)
        ]
    except Exception as e:
        # Handle any other errors
        raise Exception(f"Error generating initial tasks: {str(e)}")