from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, List
from supabase_client import supabase, FOLDERS_TABLE
from schemas import FolderCreate, FolderResponse
from auth_utils import get_current_user_email
from datetime import datetime

router = APIRouter()

@router.post("/create", response_model=FolderResponse)
async def create_folder(
    folder_data: FolderCreate,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Check if parent folder exists and belongs to user
        if folder_data.parent_id:
            parent_result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_data.parent_id).eq("owner_id", user_id).execute()
            if not parent_result.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent folder not found"
                )
        
        # Create new folder
        import uuid
        folder_id = str(uuid.uuid4())
        new_folder = {
            "id": folder_id,
            "name": folder_data.name,
            "parent_id": folder_data.parent_id,
            "owner_id": user_id,
            "is_starred": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table(FOLDERS_TABLE).insert(new_folder).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create folder")
        
        created_folder = result.data[0]
        return FolderResponse(
            id=created_folder["id"],
            name=created_folder["name"],
            parent_id=created_folder["parent_id"],
            owner_id=created_folder["owner_id"],
            is_starred=created_folder["is_starred"],
            created_at=datetime.fromisoformat(created_folder["created_at"]),
            updated_at=datetime.fromisoformat(created_folder["updated_at"]) if created_folder["updated_at"] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Create folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/list", response_model=List[FolderResponse])
async def list_folders(
    parent_id: Optional[str] = None,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Build query
        query = supabase.table(FOLDERS_TABLE).select("*").eq("owner_id", user_id)
        
        if parent_id:
            query = query.eq("parent_id", parent_id)
        else:
            query = query.is_("parent_id", None)
        
        result = query.execute()
        
        if not result.data:
            return []
        
        # Convert to FolderResponse objects
        folders = []
        for folder_data in result.data:
            folders.append(FolderResponse(
                id=folder_data["id"],
                name=folder_data["name"],
                parent_id=folder_data["parent_id"],
                owner_id=folder_data["owner_id"],
                is_starred=folder_data["is_starred"],
                created_at=datetime.fromisoformat(folder_data["created_at"]),
                updated_at=datetime.fromisoformat(folder_data["updated_at"]) if folder_data["updated_at"] else None
            ))
        
        return folders
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"List folders error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{folder_id}", response_model=FolderResponse)
async def get_folder(
    folder_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get folder from database
        result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        folder_data = result.data[0]
        return FolderResponse(
            id=folder_data["id"],
            name=folder_data["name"],
            parent_id=folder_data["parent_id"],
            owner_id=folder_data["owner_id"],
            is_starred=folder_data["is_starred"],
            created_at=datetime.fromisoformat(folder_data["created_at"]),
            updated_at=datetime.fromisoformat(folder_data["updated_at"]) if folder_data["updated_at"] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{folder_id}")
async def update_folder(
    folder_id: str,
    folder_data: FolderCreate,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get folder from database
        result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        # Check if new parent folder exists and belongs to user
        if folder_data.parent_id:
            parent_result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_data.parent_id).eq("owner_id", user_id).execute()
            if not parent_result.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent folder not found"
                )
        
        # Update folder
        update_data = {
            "name": folder_data.name,
            "parent_id": folder_data.parent_id,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        supabase.table(FOLDERS_TABLE).update(update_data).eq("id", folder_id).execute()
        
        # Get updated folder
        updated_result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).execute()
        updated_folder = updated_result.data[0]
        
        return FolderResponse(
            id=updated_folder["id"],
            name=updated_folder["name"],
            parent_id=updated_folder["parent_id"],
            owner_id=updated_folder["owner_id"],
            is_starred=updated_folder["is_starred"],
            created_at=datetime.fromisoformat(updated_folder["created_at"]),
            updated_at=datetime.fromisoformat(updated_folder["updated_at"]) if updated_folder["updated_at"] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Update folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{folder_id}")
async def delete_folder(
    folder_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get folder from database
        result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        # Check if folder has subfolders or files
        from supabase_client import FILES_TABLE
        has_subfolders = supabase.table(FOLDERS_TABLE).select("id").eq("parent_id", folder_id).execute()
        has_files = supabase.table(FILES_TABLE).select("id").eq("folder_id", folder_id).execute()
        
        if has_subfolders.data or has_files.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete folder with contents"
            )
        
        # Delete folder
        supabase.table(FOLDERS_TABLE).delete().eq("id", folder_id).execute()
        
        return {"message": "Folder deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{folder_id}/star")
async def toggle_folder_star(
    folder_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        # Get user ID from email
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_id = user_result.data[0]["id"]
        
        # Get folder from database
        result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        folder_data = result.data[0]
        new_starred_status = not folder_data["is_starred"]
        
        # Update star status
        supabase.table(FOLDERS_TABLE).update({"is_starred": new_starred_status}).eq("id", folder_id).execute()
        
        return {"message": f"Folder {'starred' if new_starred_status else 'unstarred'}"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Toggle folder star error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
