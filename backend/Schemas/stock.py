from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class StockBase(BaseModel):
    medicine_id: int
    quantity: int
    batch_number: Optional[str]
    expiry_date: Optional[datetime]

class StockCreate(StockBase):
    pass

class StockUpdate(StockBase):
    quantity: Optional[int] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[datetime] = None

class StockInDBBase(StockBase):
    id: int
    admin_id: Optional[int]  # Admin who last updated
    last_updated: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True

class StockOut(StockInDBBase):
    pass

class StockWithMedicine(StockInDBBase):
    medicine: Any