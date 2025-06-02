from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from databases.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    is_admin = Column(Boolean, default=False)
    
    # Define relationships
    invoices = relationship("Invoice", back_populates="user")
    
    # For admin users
    stocks = relationship("Stock", back_populates="admin")
    