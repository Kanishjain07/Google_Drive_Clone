from fastapi import APIRouter, HTTPException, status
from schemas import UserCreate, UserLogin, UserResponse, Token
from supabase_client import supabase, USERS_TABLE
from auth_utils import get_password_hash, verify_password, create_access_token
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    try:
        # Check if user already exists
        existing_user = supabase.table(USERS_TABLE).select("*").eq("email", user_data.email).execute()
        
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user_data.password)
        
        new_user = {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table(USERS_TABLE).insert(new_user).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        created_user = result.data[0]
        return UserResponse(
            id=created_user["id"],
            email=created_user["email"],
            name=created_user["name"],
            is_active=created_user["is_active"],
            created_at=datetime.fromisoformat(created_user["created_at"]),
            updated_at=datetime.fromisoformat(created_user["updated_at"]) if created_user["updated_at"] else None
        )
        
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        # Authenticate user
        result = supabase.table(USERS_TABLE).select("*").eq("email", user_data.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = result.data[0]
        
        if not verify_password(user_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["email"]}
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user_email: str):
    try:
        result = supabase.table(USERS_TABLE).select("*").eq("email", current_user_email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = result.data[0]
        return UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            is_active=user["is_active"],
            created_at=datetime.fromisoformat(user["created_at"]),
            updated_at=datetime.fromisoformat(user["updated_at"]) if user["updated_at"] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
