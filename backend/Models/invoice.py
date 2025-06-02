from sqlalchemy import Column, Integer,String, ForeignKey,Float, DateTime
from sqlalchemy.orm import relationship
from databases.database import Base
from sqlalchemy.sql import func

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # User who generated
    amount = Column(Float)
    tax = Column(Float, default=0)
    total_amount = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Define relationships
    order = relationship("Order", back_populates="invoice")
    user = relationship("User", back_populates="invoices")