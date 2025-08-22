from typing import Optional, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from Models.invoice import InvoiceStatus

class InvoiceBase(BaseModel):
    order_id: int
    amount: float = Field(..., gt=0)
    tax: float = Field(default=0, ge=0)
    discount: float = Field(default=0, ge=0)
    notes: Optional[str] = None
    terms: Optional[str] = None
    due_date: Optional[datetime] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    tax: Optional[float] = Field(None, ge=0)
    discount: Optional[float] = Field(None, ge=0)
    status: Optional[InvoiceStatus] = None
    notes: Optional[str] = None
    terms: Optional[str] = None
    due_date: Optional[datetime] = None
    paid_date: Optional[datetime] = None

class InvoiceInDBBase(InvoiceBase):
    id: int
    invoice_number: str
    user_id: int  # User who generated
    total_amount: float
    status: InvoiceStatus
    issued_date: datetime
    paid_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InvoiceOut(InvoiceInDBBase):
    pass

# Detailed invoice with order and customer information
class OrderMedicineDetail(BaseModel):
    medicine_name: str
    quantity: int
    unit_price: float
    total_price: float

class InvoiceWithDetails(InvoiceInDBBase):
    customer_name: str
    customer_email: Optional[str]
    customer_phone: Optional[str]
    customer_address: Optional[str]
    order_date: datetime
    order_medicines: List[OrderMedicineDetail]

class InvoicePrintData(BaseModel):
    invoice: InvoiceWithDetails
    company_info: dict = {
        "name": "MediQ Pharmacy",
        "address": "123 Health Street, Medical City, MC 12345",
        "phone": "+1 (555) 123-4567",
        "email": "info@mediq.com",
        "website": "www.mediq.com"
    }