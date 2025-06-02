from pydantic import BaseModel,Field
from typing import Optional, Any

class MedicineBase(BaseModel):
    name: str
    price : float = Field(..., gt=0, description="Price must be greater than 0")

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(MedicineBase):
    name: Optional[str] = None
    price: Optional[float] = Field(None, gt=0, description="Price must be greater than 0")


class MedicineInDBBase(MedicineBase):
    id: int

    class Config:
        orm_mode = True

class MedicineOut(MedicineInDBBase):
    pass

class MedicineWithStock(MedicineInDBBase):
    stock: Any = None