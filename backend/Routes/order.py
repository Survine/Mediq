from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.order import Order
from Schemas.order import OrderCreate, OrderUpdate
from Views.order import fetch_all_orders, fetch_order_by_id, create_order, update_order, delete_order, fetch_order_with_details

router = APIRouter()

@router.get("/test")
def test_orders():
    return {"message": "Orders endpoint is working"}

@router.get("")
def get_all_orders(db: Session = Depends(get_db)):
    orders = fetch_all_orders(db)
    result = []

    for order in orders:
        customer = None
        if getattr(order, "customer", None):
            customer = {
                "id": order.customer.id,
                "name": order.customer.name,
                "email": order.customer.email,
                "phone": order.customer.phone,
                "address": order.customer.address,
            }

        order_medicines = []
        for item in getattr(order, "order_medicines", []) or []:
            med = getattr(item, "medicine", None)
            order_medicines.append(
                {
                    "id": item.id,
                    "order_id": item.order_id,
                    "medicine_id": item.medicine_id,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "medicine": (
                        {"id": med.id, "name": med.name, "price": med.price} if med else None
                    ),
                }
            )

        result.append(
            {
                "id": order.id,
                "customer_id": order.customer_id,
                "total_amount": order.total_amount,
                "order_date": order.order_date,
                "status": getattr(order.status, "value", order.status),
                "customer": customer,
                "order_medicines": order_medicines,
                "invoice": getattr(order, "invoice", None),
            }
        )

    return result

@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = fetch_order_with_details(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    customer = None
    if getattr(order, "customer", None):
        customer = {
            "id": order.customer.id,
            "name": order.customer.name,
            "email": order.customer.email,
            "phone": order.customer.phone,
            "address": order.customer.address,
        }

    order_medicines = []
    for item in getattr(order, "order_medicines", []) or []:
        med = getattr(item, "medicine", None)
        order_medicines.append(
            {
                "id": item.id,
                "order_id": item.order_id,
                "medicine_id": item.medicine_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "medicine": (
                    {"id": med.id, "name": med.name, "price": med.price} if med else None
                ),
            }
        )

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "total_amount": order.total_amount,
        "order_date": order.order_date,
        "status": getattr(order.status, "value", order.status),
        "customer": customer,
        "order_medicines": order_medicines,
        "invoice": getattr(order, "invoice", None),
    }

@router.get("/details/{order_id}")
def get_order_with_details(order_id: int, db: Session = Depends(get_db)):
    order = fetch_order_with_details(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.post("")
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
    return {"detail": "Order deleted successfully"}