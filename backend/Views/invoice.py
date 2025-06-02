from typing import List, Optional
from fastapi import HTTPException, status
import uuid
from sqlalchemy.orm import Session, joinedload


from Models.invoice import Invoice
from Schemas.invoice import InvoiceCreate, InvoiceUpdate
from Models.order import Order,OrderStatus


def fetch_invoice_by_id(db: Session, invoice_id: int) -> Optional[Invoice]:
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()


def fetch_invoice_by_order_id(db: Session, order_id: int) -> Optional[Invoice]:
    return db.query(Invoice).filter(Invoice.order_id == order_id).first()


def fetch_all_invoices(db: Session) -> List[Invoice]:
    return db.query(Invoice).all()

def fetch_invoice_with_details(db: Session, invoice_id: int) -> Optional[Invoice]:
    return db.query(Invoice).options(
        joinedload(Invoice.order),
        joinedload(Invoice.user)
    ).filter(Invoice.id == invoice_id).first()

def create_invoice(db: Session, invoice_in: InvoiceCreate, user_id: int) -> Invoice:
    # Check if order exists
    order = db.query(Order).filter(Order.id == invoice_in.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {invoice_in.order_id} not found",
        )
    
    # Check if invoice for this order already exists
    existing_invoice = fetch_invoice_by_order_id(db, order_id=invoice_in.order_id)
    if existing_invoice:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invoice for order ID {invoice_in.order_id} already exists",
        )
    
    # Generate invoice number
    invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
    
    # Calculate total amount
    total_amount = invoice_in.amount + invoice_in.tax
    
    # Create invoice
    db_invoice = Invoice(
        invoice_number=invoice_number,
        order_id=invoice_in.order_id,
        user_id=user_id,
        amount=invoice_in.amount,
        tax=invoice_in.tax,
        total_amount=total_amount
    )
    
    # Update order status to completed
    order.status = OrderStatus.COMPLETED  # Fixed this line
    db.add(order)
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def update_invoice(db: Session, invoice_id: int, invoice_in: InvoiceUpdate) -> Invoice:
    db_invoice = fetch_invoice_by_id(db, invoice_id=invoice_id)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    
    update_data = invoice_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    
    # Recalculate total if tax changed
    if "tax" in update_data:
        db_invoice.total_amount = db_invoice.amount + db_invoice.tax
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_invoice(db: Session, invoice_id: int) -> Invoice:
    db_invoice = fetch_invoice_by_id(db, invoice_id=invoice_id)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    
    db.delete(db_invoice)
    db.commit()
    return {"details": "Invoice deleted successfully"}