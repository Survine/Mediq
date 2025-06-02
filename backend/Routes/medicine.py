from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from databases.database import get_db
from Models.medicine import Medicine
from Schemas.medicine import MedicineCreate, MedicineUpdate,MedicineOut
from Views.medicine import (
    fetch_medicine_by_id,
    fetch_medicine_by_name,
    fetch_all_medicines,
    create_new_medicine,
    update_existing_medicine,
    delete_medicine_by_id,
)

router = APIRouter()

#Gives all medicines
@router.get("/", response_model=list[MedicineOut])
def get_all_medicines(db: Session = Depends(get_db)):
    return fetch_all_medicines(db)

#Gives medicine by id
@router.get("/{medicine_id}", response_model=MedicineOut)
def get_medicine_by_id(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med

#Gives medicine by name
@router.get("/name/{medicine_name}", response_model=MedicineOut)
def get_medicine_by_name(medicine_name: str, db: Session = Depends(get_db)):
    return fetch_medicine_by_name(db, medicine_name)

#Creates a new medicine
@router.post("/", response_model=MedicineOut)
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    return create_new_medicine(db, medicine)

#Updates a medicine
@router.put("/{medicine_id}", response_model=MedicineOut)
def update_medicine(medicine_id: int, medicine: MedicineUpdate, db: Session = Depends(get_db)):
    return update_existing_medicine(db, medicine_id, medicine)

#Deletes a medicine
@router.delete("/{medicine_id}", response_model=MedicineOut)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    return delete_medicine_by_id(db, medicine_id)