from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.order import Order, OrderMedicine
from Schemas.order import OrderCreate, OrderUpdate, OrderDetail
from Views.order import fetch_all_orders, fetch_order_by_id, create_order, update_order, delete_order, fetch_order_with_details

router = APIRouter()

@router.get("/", response_model=List[OrderDetail])
def get_all_orders(db: Session = Depends(get_db)) -> List[OrderDetail]:
    orders = fetch_all_orders(db)
    return orders

@router.get("/{order_id}", response_model=OrderDetail)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)) -> OrderDetail:
    order = fetch_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.get("/details/{order_id}", response_model=OrderDetail)
def get_order_with_details(order_id: int, db: Session = Depends(get_db)) -> OrderDetail:
    order = fetch_order_with_details(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.post("/", response_model=OrderDetail)
def create_new_order(order: OrderCreate, db: Session = Depends(get_db)) -> OrderDetail:
    return create_order(db, order)

@router.put("/{order_id}", response_model=OrderDetail)
def update_existing_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)) -> OrderDetail:
    return update_order(db, order_id, order)

@router.delete("/{order_id}", response_model=OrderDetail)
def delete_order_by_id(order_id: int, db: Session = Depends(get_db)) -> OrderDetail:
    order = delete_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order