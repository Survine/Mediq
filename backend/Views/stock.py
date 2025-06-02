from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from Models.stock import Stock
from Models.medicine import Medicine

from Schemas.stock import StockCreate, StockUpdate


def fetch_stock_by_id(db: Session, stock_id: int) -> Optional[Stock]:
    return db.query(Stock).filter(Stock.id == stock_id).first()

def fetch_all_stocks(db: Session) -> List[Stock]:
    return db.query(Stock).options(joinedload(Stock.medicine)).all()

def fetch_stock_by_medicine_id(db: Session, medicine_id: int) -> Optional[Stock]:
    return db.query(Stock).filter(Stock.medicine_id == medicine_id).first()

def fetch_stock_by_medicine(db: Session, medicine_name: str) -> Optional[Stock]:
    return db.query(Stock).join(Medicine).filter(Medicine.name == medicine_name).first()

def create_stock(db: Session, stock_in: StockCreate, admin_id: int) -> Stock:
    # Check if medicine exists
    medicine = db.query(Medicine).filter(Medicine.id == stock_in.medicine_id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medicine with ID {stock_in.medicine_id} not found",
        )
    
    # Check if stock for this medicine already exists
    existing_stock = fetch_stock_by_medicine_id(db, medicine_id=stock_in.medicine_id)
    if existing_stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stock for medicine ID {stock_in.medicine_id} already exists. Use update instead.",
        )
    
    # Create new stock entry
    db_stock = Stock(
        medicine_id=stock_in.medicine_id,
        quantity=stock_in.quantity,
        batch_number=stock_in.batch_number,
        expiry_date=stock_in.expiry_date,
        admin_id=admin_id,
    )
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def update_stock(db: Session, stock_id: int, stock_in: StockUpdate, admin_id: int) -> Stock:
    db_stock = fetch_stock_by_id(db, stock_id=stock_id)
    if not db_stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found",
        )
    
    update_data = stock_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_stock, field, value)
    
    # Update the admin ID to reflect who made the change
    db_stock.admin_id = admin_id
    
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def delete_stock(db: Session, stock_id: int) -> Stock:
    db_stock = fetch_stock_by_id(db, stock_id=stock_id)
    if not db_stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found",
        )
    
    db.delete(db_stock)
    db.commit()
    return {"detail": "Stock deleted successfully"}
