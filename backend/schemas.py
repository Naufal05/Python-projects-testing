from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

#USer Schema

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class USerOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

#Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

#Task Schema
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Pending"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True