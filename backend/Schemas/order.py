from pydantic import BaseModel, Field
from typing import Optional, Any, List

class OrderMedicineBase(BaseModel):
    medicine_id: int
    quantity: int = Field(..., gt=0, description="Quantity must be greater than 0")
    unit_price: Optional[float] = Field(None, gt=0, description="Price must be greater than 0")

class OrderMedicineCreate(OrderMedicineBase):
    pass

class OrderMedicineUpdate(OrderMedicineBase):
    medicine_id: Optional[int] = None
    quantity: Optional[int] = Field(None, gt=0, description="Quantity must be greater than 0")

class OrderMedicineInDBBase(OrderMedicineBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderMedicine(OrderMedicineInDBBase):
    pass

class OrderBase(BaseModel):
    customer_id: int

class OrderCreate(OrderBase):
    order_medicines: List[OrderMedicineCreate]

class OrderUpdate(OrderBase):
    pass

class OrderInDBBase(OrderBase):
    id: int
    total_amount: float
    status: str

    class Config:
        from_attributes = True

class Order(OrderInDBBase):
    order_medicines: List[OrderMedicine] = []

class OrderDetail(OrderInDBBase):
    customer: Any
    order_medicines: List[OrderMedicine] = []
    invoice: Optional[Any] = None