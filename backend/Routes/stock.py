from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.stock import Stock
from Schemas.stock import StockCreate, StockUpdate, StockOut
from Views.stock import (
    fetch_stock_by_id,
    fetch_all_stocks,
    fetch_stock_by_medicine_id,
    fetch_stock_by_medicine,
    create_stock,
    update_stock,
    delete_stock,
)

router = APIRouter()

#Gives all stocks
@router.get("/", response_model=list[StockOut])
def get_all_stocks(db: Session = Depends(get_db)):
    return fetch_all_stocks(db)

#Gives stock by id
@router.get("/{stock_id}", response_model=StockOut)
def get_stock_by_id(stock_id: int, db: Session = Depends(get_db)):
    stock = fetch_stock_by_id(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

#Gives stock by medicine id
@router.get("/medicine/{medicine_id}", response_model=StockOut)
def get_stock_by_medicine_id(medicine_id: int, db: Session = Depends(get_db)):
    stock = fetch_stock_by_medicine_id(db, medicine_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

#Gives stock with medicine name
@router.get("/medicine/name/{medicine_name}", response_model=StockOut)
def get_stock_by_medicine_name(medicine_name: str, db: Session = Depends(get_db)):
    stock = fetch_stock_by_medicine(db, medicine_name)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

#Creates a new stock
@router.post("/", response_model=StockOut)
def create_new_stock(stock: StockCreate, db: Session = Depends(get_db), admin_id: int = 1):
    return create_stock(db, stock, admin_id)

#Updates a stock
@router.put("/{stock_id}", response_model=StockOut)
def update_existing_stock(stock_id: int, stock: StockUpdate, db: Session = Depends(get_db), admin_id: int = 1):
    return update_stock(db, stock_id, stock, admin_id)

#Deletes a stock
@router.delete("/{stock_id}", response_model=StockOut)
def delete_existing_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = delete_stock(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock