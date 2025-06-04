from typing import Optional, List
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    is_admin: Optional[bool] = False

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class UserInDBBase(UserBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True

class UserOut(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str