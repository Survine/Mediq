from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.order import Order, OrderMedicine
from Schemas.order import OrderCreate, OrderUpdate, OrderDetail
from Views.order import fetch_all_orders, fetch_order_by_id, create_order, update_order, delete_order, fetch_order_with_details

router = APIRouter()

@router.get("/test")
def test_orders():
    return {"message": "Orders endpoint is working"}

@router.get("/")
def get_all_orders(db: Session = Depends(get_db)):
    try:
        orders = db.query(Order).all()
        result = []
        for order in orders:
            # Load customer separately if needed
            customer = None
            if order.customer_id:
                from Models.customer import Customer
                customer_obj = db.query(Customer).filter(Customer.id == order.customer_id).first()
                if customer_obj:
                    customer = {
                        "id": customer_obj.id,
                        "name": customer_obj.name,
                        "email": customer_obj.email,
                        "phone": customer_obj.phone,
                        "address": customer_obj.address
                    }
            
            order_dict = {
                "id": order.id,
                "customer_id": order.customer_id,
                "total_amount": order.total_amount,
                "order_date": order.order_date,
                "status": order.status,
                "customer": customer,
                "order_medicines": [],
                "invoice": None
            }
            result.append(order_dict)
        return result
    except Exception as e:
        return {"error": str(e)}

@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = fetch_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.get("/details/{order_id}")
def get_order_with_details(order_id: int, db: Session = Depends(get_db)):
    order = fetch_order_with_details(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.post("/")
def create_new_order(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)

@router.put("/{order_id}")
def update_existing_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    return update_order(db, order_id, order)

@router.delete("/{order_id}")
def delete_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = delete_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order