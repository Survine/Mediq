from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from databases.database import Base
from sqlalchemy.sql import func
import enum

class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # User who generated
    amount = Column(Float)  # Subtotal before tax
    tax = Column(Float, default=0)
    discount = Column(Float, default=0)
    total_amount = Column(Float)  # Final amount after tax and discount
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    notes = Column(Text, nullable=True)
    terms = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    issued_date = Column(DateTime(timezone=True), server_default=func.now())
    paid_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Define relationships (using string references to avoid circular imports)
    order = relationship("Order", back_populates="invoice")
    user = relationship("User", back_populates="invoices")