from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from databases.database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), unique=True)
    quantity = Column(Integer, default=0)
    batch_number = Column(String)
    expiry_date = Column(DateTime)
    admin_id = Column(Integer, ForeignKey("users.id"))
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Define relationships
    medicine = relationship("Medicine", back_populates="stock")
    admin = relationship("User", back_populates="stocks")