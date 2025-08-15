from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# File schemas
class FileBase(BaseModel):
    name: str
    mime_type: str
    size: int
    folder_id: Optional[str] = None

class FileCreate(FileBase):
    storage_path: str

class FileResponse(FileBase):
    id: str
    storage_path: str
    owner_id: str
    is_starred: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Folder schemas
class FolderBase(BaseModel):
    name: str
    parent_id: Optional[str] = None

class FolderCreate(FolderBase):
    pass

class FolderResponse(FolderBase):
    id: str
    owner_id: str
    is_starred: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
