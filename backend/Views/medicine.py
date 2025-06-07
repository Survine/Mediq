from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Models.medicine import Medicine
from Schemas.medicine import MedicineCreate, MedicineUpdate
from Models.stock import Stock


def fetch_medicine_by_id(db: Session, medicine_id: int) -> Optional[Medicine]:
    return db.query(Medicine).filter(Medicine.id == medicine_id).first()


def fetch_medicine_by_name(db: Session, name: str) -> Optional[Medicine]:
    return db.query(Medicine).filter(Medicine.name == name).first()


def fetch_all_medicines(db: Session) -> List[Medicine]:
    return db.query(Medicine).all()

def create_new_medicine(db: Session, medicine_data: MedicineCreate) -> Medicine:
    new_medicine = Medicine(
        name=medicine_data.name,
        price=medicine_data.price,
    )
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return new_medicine

def update_existing_medicine(db: Session, medicine_id: int, medicine_data: MedicineUpdate) -> Medicine:
    existing_medicine = fetch_medicine_by_id(db, medicine_id)

    if not existing_medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    # Only update fields that are provided (exclude unset fields)
    updated_fields = medicine_data.model_dump(exclude_unset=True)

    for field_name, new_value in updated_fields.items():
        setattr(existing_medicine, field_name, new_value)

    db.commit()
    db.refresh(existing_medicine)
    return existing_medicine


def delete_medicine_by_id(db: Session, medicine_id: int) -> Medicine:
    medicine_to_delete = fetch_medicine_by_id(db, medicine_id)
    if not medicine_to_delete:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(medicine_to_delete)
    db.commit()
    return medicine_to_delete

