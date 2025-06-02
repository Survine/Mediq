from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.invoice import Invoice
from Schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceOut
from Views.invoice import (
    fetch_invoice_by_id,
    fetch_invoice_by_order_id,
    fetch_all_invoices,
    create_invoice,
    update_invoice,
    delete_invoice,
    fetch_invoice_with_details,
)

router = APIRouter()

@router.get("/", response_model=List[InvoiceOut])
def get_all_invoices(db: Session = Depends(get_db)) -> List[InvoiceOut]:
    return fetch_all_invoices(db)

@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice_by_id(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    invoice = fetch_invoice_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.get("/order/{order_id}", response_model=InvoiceOut)
def get_invoice_by_order_id(order_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    invoice = fetch_invoice_by_order_id(db, order_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice


@router.get("/details/{invoice_id}", response_model=InvoiceOut)
def get_invoice_with_details(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    invoice = fetch_invoice_with_details(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.post("/", response_model=InvoiceOut)
def create_new_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), user_id: int = 1) -> InvoiceOut:
    return create_invoice(db, invoice, user_id)

@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_existing_invoice(invoice_id: int, invoice: InvoiceUpdate, db: Session = Depends(get_db)) -> InvoiceOut:
    return update_invoice(db, invoice_id, invoice)

@router.delete("/{invoice_id}", response_model=InvoiceOut)
def delete_existing_invoice(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    invoice = delete_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice
