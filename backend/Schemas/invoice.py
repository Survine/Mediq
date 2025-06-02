from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

class InvoiceBase(BaseModel):
    order_id: int
    amount: float = Field(..., gt=0)
    tax: float = Field(..., ge=0)

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    tax: Optional[float] = Field(None, ge=0)

class InvoiceInDBBase(InvoiceBase):
    id: int
    invoice_number: str
    user_id: int  # User who generated
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceOut(InvoiceInDBBase):
    pass

class InvoiceWithDetails(InvoiceInDBBase):
    order: Any
    user: Any