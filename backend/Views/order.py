from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from Models.order import Order, OrderMedicine
from Models.medicine import Medicine
from Models.stock import Stock

from Schemas.order import OrderCreate, OrderUpdate

def fetch_all_orders(db: Session) -> List[Order]:
    try:
        return db.query(Order).options(
            joinedload(Order.customer),
            joinedload(Order.order_medicines).joinedload(OrderMedicine.medicine),
            joinedload(Order.invoice)
        ).all()
    except Exception as e:
        # If joinedload fails, try without it
        print(f"Error in fetch_all_orders: {str(e)}")
        return db.query(Order).all()

def fetch_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def fetch_order_with_details(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.order_medicines).joinedload(OrderMedicine.medicine),
        joinedload(Order.invoice)
    ).filter(Order.id == order_id).first()



def create_order(db: Session, order_in: OrderCreate) -> Order:
    # Create the order first
    db_order = Order(
        customer_id=order_in.customer_id,
    )
    db.add(db_order)
    db.flush()  # Get the order ID without committing yet
    
    total_amount = 0.0
    
    # Add the medicines to the order
    for item in order_in.order_medicines:
        # Get the medicine to check price and stock
        medicine = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        if not medicine:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medicine with ID {item.medicine_id} not found",
            )
        
        # Check if there's enough stock
        stock = db.query(Stock).filter(Stock.medicine_id == item.medicine_id).first()
        if not stock or stock.quantity < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for medicine {medicine.name}",
            )
        
        # Deduct the quantity from stock
        stock.quantity -= item.quantity
        db.add(stock)
        
        # Use the medicine price if unit_price is not provided
        unit_price = item.unit_price if item.unit_price else medicine.price
        
        # Create the order medicine relation
        db_order_medicine = OrderMedicine(
            order_id=db_order.id,
            medicine_id=item.medicine_id,
            quantity=item.quantity,
            unit_price=unit_price
        )
        db.add(db_order_medicine)
        
        # Add to total
        total_amount += unit_price * item.quantity
    
    # Update order total
    db_order.total_amount = total_amount
    db.add(db_order)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: int, order_in: OrderUpdate) -> Order:
    db_order = fetch_order_by_id(db, order_id=order_id)
    if not db_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    update_data = order_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int) -> Order:
    db_order = fetch_order_by_id(db, order_id=order_id)
    if not db_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Return items to stock
    order_medicines = db.query(OrderMedicine).filter(OrderMedicine.order_id == order_id).all()
    for order_med in order_medicines:
        stock = db.query(Stock).filter(Stock.medicine_id == order_med.medicine_id).first()
        if stock:
            stock.quantity += order_med.quantity
            db.add(stock)
    
    # Store the order before deletion
    deleted_order = db_order
    db.delete(db_order)
    db.commit()
    return deleted_order