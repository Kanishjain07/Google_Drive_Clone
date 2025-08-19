from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, List
from supabase_client import supabase, FOLDERS_TABLE, FILES_TABLE
from schemas import FolderCreate, FolderResponse
from auth_utils import get_current_user_email
from datetime import datetime
import uuid

router = APIRouter()

# 📂 Create Folder
@router.post("/create", response_model=FolderResponse)
async def create_folder(
    folder_data: FolderCreate,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        # Validate parent folder
        if folder_data.parent_id:
            parent_result = supabase.table(FOLDERS_TABLE).select("id").eq("id", folder_data.parent_id).eq("owner_id", user_id).execute()
            if not parent_result.data:
                raise HTTPException(status_code=404, detail="Parent folder not found")

        folder_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        new_folder = {
            "id": folder_id,
            "name": folder_data.name,
            "parent_id": folder_data.parent_id,
            "owner_id": user_id,
            "is_starred": False,
            "created_at": now,
            "updated_at": None
        }

        result = supabase.table(FOLDERS_TABLE).insert(new_folder).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create folder")

        created_folder = result.data[0]
        return FolderResponse(
            **created_folder,
            created_at=datetime.fromisoformat(created_folder["created_at"]),
            updated_at=datetime.fromisoformat(created_folder["updated_at"]) if created_folder["updated_at"] else None
        )

    except Exception as e:
        print(f"Create folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 📂 List Folders
@router.get("/list", response_model=List[FolderResponse])
async def list_folders(
    parent_id: Optional[str] = None,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        query = supabase.table(FOLDERS_TABLE).select("*").eq("owner_id", user_id)
        if parent_id:
            query = query.eq("parent_id", parent_id)
        else:
            query = query.is_("parent_id", None)

        result = query.execute()
        if not result.data:
            return []

        return [
            FolderResponse(
                **folder,
                created_at=datetime.fromisoformat(folder["created_at"]),
                updated_at=datetime.fromisoformat(folder["updated_at"]) if folder["updated_at"] else None
            )
            for folder in result.data
        ]

    except Exception as e:
        print(f"List folders error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 📂 Get Folder
@router.get("/{folder_id}", response_model=FolderResponse)
async def get_folder(folder_id: str, current_user_email: str = Depends(get_current_user_email)):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        result = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Folder not found")

        folder = result.data[0]
        return FolderResponse(
            **folder,
            created_at=datetime.fromisoformat(folder["created_at"]),
            updated_at=datetime.fromisoformat(folder["updated_at"]) if folder["updated_at"] else None
        )
    except Exception as e:
        print(f"Get folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 📂 Update Folder
@router.put("/{folder_id}", response_model=FolderResponse)
async def update_folder(
    folder_id: str,
    folder_data: FolderCreate,
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        folder = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).eq("owner_id", user_id).execute()
        if not folder.data:
            raise HTTPException(status_code=404, detail="Folder not found")

        if folder_data.parent_id:
            parent = supabase.table(FOLDERS_TABLE).select("id").eq("id", folder_data.parent_id).eq("owner_id", user_id).execute()
            if not parent.data:
                raise HTTPException(status_code=404, detail="Parent folder not found")

        update_data = {
            "name": folder_data.name,
            "parent_id": folder_data.parent_id,
            "updated_at": datetime.utcnow().isoformat()
        }
        supabase.table(FOLDERS_TABLE).update(update_data).eq("id", folder_id).execute()

        updated = supabase.table(FOLDERS_TABLE).select("*").eq("id", folder_id).execute().data[0]
        return FolderResponse(
            **updated,
            created_at=datetime.fromisoformat(updated["created_at"]),
            updated_at=datetime.fromisoformat(updated["updated_at"]) if updated["updated_at"] else None
        )
    except Exception as e:
        print(f"Update folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 📂 Delete Folder
@router.delete("/{folder_id}")
async def delete_folder(folder_id: str, current_user_email: str = Depends(get_current_user_email)):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        folder = supabase.table(FOLDERS_TABLE).select("id").eq("id", folder_id).eq("owner_id", user_id).execute()
        if not folder.data:
            raise HTTPException(status_code=404, detail="Folder not found")

        # Check contents
        if supabase.table(FOLDERS_TABLE).select("id").eq("parent_id", folder_id).execute().data:
            raise HTTPException(status_code=400, detail="Cannot delete folder with subfolders")
        if supabase.table(FILES_TABLE).select("id").eq("folder_id", folder_id).execute().data:
            raise HTTPException(status_code=400, detail="Cannot delete folder with files")

        supabase.table(FOLDERS_TABLE).delete().eq("id", folder_id).execute()
        return {"message": "Folder deleted successfully"}
    except Exception as e:
        print(f"Delete folder error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ⭐ Toggle Star
@router.put("/{folder_id}/star")
async def toggle_folder_star(folder_id: str, current_user_email: str = Depends(get_current_user_email)):
    try:
        user_result = supabase.table("users").select("id").eq("email", current_user_email).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user_result.data[0]["id"]

        result = supabase.table(FOLDERS_TABLE).select("is_starred").eq("id", folder_id).eq("owner_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Folder not found")

        current_star = result.data[0]["is_starred"]
        supabase.table(FOLDERS_TABLE).update({"is_starred": not current_star}).eq("id", folder_id).execute()

        return {"message": f"Folder {'starred' if not current_star else 'unstarred'}"}
    except Exception as e:
        print(f"Toggle folder star error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
