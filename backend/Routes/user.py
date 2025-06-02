from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.user import User
from Schemas.user import UserCreate, UserUpdate, UserOut
from Views.user import (
    fetch_user_by_id,
    fetch_all_users,
    fetch_user_by_email,
    create_user,
    update_user,
    delete_user,
    fetch_user_by_username,
)

router = APIRouter()

@router.get("/", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return fetch_all_users(db)

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = fetch_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/email/{email}", response_model=UserOut)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = fetch_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/username/{username}", response_model=UserOut)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = fetch_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.put("/{user_id}", response_model=UserOut)
def update_existing_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    return update_user(db, user_id, user)

@router.delete("/{user_id}", response_model=UserOut)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    user = delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user