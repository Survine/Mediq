from typing import Optional, List
from pydantic import BaseModel, EmailStr

class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerInDBBase(CustomerBase):
    id: int

    class Config:
        from_attributes = True

class Customer(CustomerInDBBase):
    pass

class CustomerWithOrders(CustomerInDBBase):
    orders: List = []