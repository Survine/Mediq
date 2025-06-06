from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from Models.customer import Customer

from Schemas.customer import CustomerCreate, CustomerUpdate

def fetch_all_customers(db: Session) -> List[Customer]:
    return db.query(Customer).options(joinedload(Customer.orders)).all()

def fetch_customer_by_id(db: Session, customer_id: int) -> Customer:
    customer = db.query(Customer).options(joinedload(Customer.orders)).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer

def fetch_customer_by_email(db: Session, email: str) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.email == email).first()


def create_customer(db: Session, customer_in: CustomerCreate) -> Customer:
    # Check if a customer with this email already exists
    db_customer = fetch_customer_by_email(db, email=customer_in.email)
    if db_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new customer
    db_customer = Customer(
        name=customer_in.name,
        email=customer_in.email,
        phone=customer_in.phone,
        address=customer_in.address,
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer_in: CustomerUpdate) -> Customer:
    db_customer = fetch_customer_by_id(db, customer_id=customer_id)
    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    
    # Check if email is being updated and if it's already in use
    if customer_in.email and customer_in.email != db_customer.email:
        email_exists = fetch_customer_by_email(db, email=customer_in.email)
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
    
    update_data = customer_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int) -> Customer:
    db_customer = fetch_customer_by_id(db, customer_id=customer_id)
    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    
    db.delete(db_customer)
    db.commit()
    return {"detail": "Customer deleted successfully"}