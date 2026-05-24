from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Models.user import User
from Schemas.user import UserCreate, UserUpdate

import hashlib


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def fetch_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def fetch_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def fetch_all_users(db: Session) -> List[User]:
    return db.query(User).all()

def fetch_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    # Check if user with this email exists
    db_user = fetch_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Check if user with this username exists
    db_user = fetch_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already in use",
        )
    
    # Create new user
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=_hash_password(user_in.password),
        is_admin=user_in.is_admin,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_in: UserUpdate) -> User:
    db_user = fetch_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    update_data = user_in.model_dump(exclude_unset=True)

    # Map incoming password -> hashed_password (User model has no 'password' column)
    if "password" in update_data:
        db_user.hashed_password = _hash_password(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> User:
    db_user = fetch_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent deleting users referenced by invoices/stocks
    if getattr(db_user, "invoices", None) and len(db_user.invoices) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete user with existing invoices",
        )
    if getattr(db_user, "stocks", None) and len(db_user.stocks) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete user with existing stock updates",
        )

    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}
