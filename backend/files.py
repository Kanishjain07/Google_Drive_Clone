from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, List
import os
import shutil
import uuid
from datetime import datetime
from supabase_client import supabase, FILES_TABLE
from schemas import FileResponse
from auth_utils import get_current_user_email

router = APIRouter()

# File storage directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=FileResponse)
async def upload_file(
    file: UploadFile = File(...),
    folder_id: Optional[str] = Form("null"),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create user directory if it doesn't exist
        user_dir = os.path.join(UPLOAD_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(user_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Create file record in database
        file_id = str(uuid.uuid4())
        new_file = {
            "id": file_id,
            "name": file.filename,
            "mime_type": file.content_type or "application/octet-stream",
            "size": file_size,
            "storage_path": file_path,
            "folder_id": folder_id,
            "owner_id": user_id,
            "is_starred": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table(FILES_TABLE).insert(new_file).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create file record")
        
        created_file = result.data[0]
        return FileResponse(
            id=created_file["id"],
            name=created_file["name"],
            mime_type=created_file["mime_type"],
            size=created_file["size"],
            storage_path=created_file["storage_path"],
            folder_id=created_file["folder_id"],
            owner_id=created_file["owner_id"],
            is_starred=created_file["is_starred"],
            created_at=datetime.fromisoformat(created_file["created_at"]),
            updated_at=datetime.fromisoformat(created_file["updated_at"]) if created_file["updated_at"] else "null"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/list", response_model=List[FileResponse])
async def list_files(
    folder_id: Optional[str] = "null",
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Build query
        query = supabase.table(FILES_TABLE).select("*").eq("owner_id", user_id)
        
        if folder_id:
            query = query.eq("folder_id", folder_id)
        else:
            query = query.is_("folder_id", "null")
        
        result = query.execute()
        
        if not result.data:
            return []
        
        # Convert to FileResponse objects
        files = []
        for file_data in result.data:
            files.append(FileResponse(
                id=file_data["id"],
                name=file_data["name"],
                mime_type=file_data["mime_type"],
                size=file_data["size"],
                storage_path=file_data["storage_path"],
                folder_id=file_data["folder_id"],
                owner_id=file_data["owner_id"],
                is_starred=file_data["is_starred"],
                created_at=datetime.fromisoformat(file_data["created_at"]),
                updated_at=datetime.fromisoformat(file_data["updated_at"]) if file_data["updated_at"] else "null"
            ))
        
        return files
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"List files error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{file_id}", response_model=FileResponse)
async def get_file(
    file_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get file from database
        result = supabase.table(FILES_TABLE).select("*").eq("id", file_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        file_data = result.data[0]
        return FileResponse(
            id=file_data["id"],
            name=file_data["name"],
            mime_type=file_data["mime_type"],
            size=file_data["size"],
            storage_path=file_data["storage_path"],
            folder_id=file_data["folder_id"],
            owner_id=file_data["owner_id"],
            is_starred=file_data["is_starred"],
            created_at=datetime.fromisoformat(file_data["created_at"]),
            updated_at=datetime.fromisoformat(file_data["updated_at"]) if file_data["updated_at"] else "null"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get file error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get file from database
        result = supabase.table(FILES_TABLE).select("*").eq("id", file_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        file_data = result.data[0]
        
        # Delete physical file
        if os.path.exists(file_data["storage_path"]):
            os.remove(file_data["storage_path"])
        
        # Delete database record
        supabase.table(FILES_TABLE).delete().eq("id", file_id).execute()
        
        return {"message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete file error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{file_id}/star")
async def toggle_file_star(
    file_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get file from database
        result = supabase.table(FILES_TABLE).select("*").eq("id", file_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        file_data = result.data[0]
        new_starred_status = not file_data["is_starred"]
        
        # Update star status
        supabase.table(FILES_TABLE).update({"is_starred": new_starred_status}).eq("id", file_id).execute()
        
        return {"message": f"File {'starred' if new_starred_status else 'unstarred'}"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Toggle file star error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
