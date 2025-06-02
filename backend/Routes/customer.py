from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.customer import Customer
from Schemas.customer import CustomerCreate, CustomerUpdate, Customer, CustomerWithOrders

router = APIRouter()

from Views.customer import (
    fetch_all_customers,
    fetch_customer_by_id,
    fetch_customer_with_orders,
    create_customer,
    update_customer,
    delete_customer,
)

#Gives all customers
@router.get("/", response_model=list[Customer])
def get_all_customers(db: Session = Depends(get_db)):
    return fetch_all_customers(db)

#Gives customer by id
@router.get("/{customer_id}", response_model=Customer)
def get_customer_by_id(customer_id: int, db: Session = Depends(get_db)):
    return fetch_customer_by_id(db, customer_id)

#Gives customer with orders by id
@router.get("/{customer_id}/orders", response_model=CustomerWithOrders)
def get_customer_with_orders(customer_id: int, db: Session = Depends(get_db)):
    return fetch_customer_with_orders(db, customer_id)

#Creates a new customer
@router.post("/", response_model=Customer)
def create_new_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, customer)

#Updates a customer
@router.put("/{customer_id}", response_model=Customer)
def update_existing_customer(customer_id: int, customer: CustomerUpdate, db: Session = Depends(get_db)):
    return update_customer(db, customer_id, customer)

#Deletes a customer
@router.delete("/{customer_id}", response_model=Customer)
def delete_customer_by_id(customer_id: int, db: Session = Depends(get_db)):
    return delete_customer(db, customer_id)