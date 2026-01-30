import os
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client credentials
SUPABASE_URL: str = os.getenv("SUPABASE_URL")
# Use the Service Role Key for backend administrative authentication checks
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Validate environment variables
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the .env file"
    )

# Create Supabase client with Service Role privileges
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Initialize HTTPBearer security scheme
security = HTTPBearer()


async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency function to verify and extract the current user from the JWT token.
    
    This function validates the Bearer token from the Authorization header
    using Supabase Auth (Admin level) and returns the authenticated user object.
    
    Args:
        token: HTTPAuthorizationCredentials containing the Bearer token
        
    Returns:
        dict: The authenticated user object from Supabase
        
    Raises:
        HTTPException: 401 Unauthorized if token is invalid, expired, or missing
    """
    try:
        # Verify the token with Supabase Auth using the Admin client
        # .get_user() validates the JWT sent from the frontend
        response = supabase.auth.get_user(token.credentials)
        
        # Check if user data is present in the response
        if response and response.user:
            # Cast User object to dict for easier use in routes
            return response.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except Exception as e:
        # Handle any authentication errors (invalid token, expired, etc.)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )