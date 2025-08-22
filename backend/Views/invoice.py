from typing import List, Optional
from fastapi import HTTPException, status
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session, joinedload

from Models.invoice import Invoice, InvoiceStatus
from Models.order import Order, OrderStatus, OrderMedicine
from Models.customer import Customer
from Models.medicine import Medicine
from Schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceWithDetails, OrderMedicineDetail

def fetch_invoice_by_id(db: Session, invoice_id: int) -> Optional[Invoice]:
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def fetch_invoice_by_order_id(db: Session, order_id: int) -> Optional[Invoice]:
    return db.query(Invoice).filter(Invoice.order_id == order_id).first()

def fetch_all_invoices(db: Session) -> List[Invoice]:
    return db.query(Invoice).order_by(Invoice.created_at.desc()).all()

def fetch_invoice_with_details(db: Session, invoice_id: int) -> Optional[InvoiceWithDetails]:
    # Get invoice with related order and customer information
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return None
    
    # Get order with customer and medicines
    order = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.order_medicines).joinedload(OrderMedicine.medicine)
    ).filter(Order.id == invoice.order_id).first()
    
    if not order or not order.customer:
        return None
    
    # Prepare order medicines details
    order_medicines = []
    for order_med in order.order_medicines:
        order_medicines.append(OrderMedicineDetail(
            medicine_name=order_med.medicine.name,
            quantity=order_med.quantity,
            unit_price=order_med.unit_price,
            total_price=order_med.quantity * order_med.unit_price
        ))
    
    # Create detailed invoice
    invoice_details = InvoiceWithDetails(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        order_id=invoice.order_id,
        user_id=invoice.user_id,
        amount=invoice.amount,
        tax=invoice.tax,
        discount=invoice.discount,
        total_amount=invoice.total_amount,
        status=invoice.status,
        notes=invoice.notes,
        terms=invoice.terms,
        due_date=invoice.due_date,
        issued_date=invoice.issued_date,
        paid_date=invoice.paid_date,
        created_at=invoice.created_at,
        updated_at=invoice.updated_at,
        customer_name=order.customer.name,
        customer_email=order.customer.email,
        customer_phone=order.customer.phone,
        customer_address=order.customer.address,
        order_date=order.order_date,
        order_medicines=order_medicines
    )
    
    return invoice_details

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
    
    # Generate invoice number with current year
    current_year = datetime.now().year
    invoice_number = f"INV-{current_year}-{uuid.uuid4().hex[:8].upper()}"
    
    # Calculate total amount: amount - discount + tax
    total_amount = invoice_in.amount - invoice_in.discount + invoice_in.tax
    
    # Set default due date (30 days from now) if not provided
    due_date = invoice_in.due_date or datetime.now() + timedelta(days=30)
    
    # Set default terms if not provided
    terms = invoice_in.terms or "Payment due within 30 days of invoice date."
    
    # Create invoice
    db_invoice = Invoice(
        invoice_number=invoice_number,
        order_id=invoice_in.order_id,
        user_id=user_id,
        amount=invoice_in.amount,
        tax=invoice_in.tax,
        discount=invoice_in.discount,
        total_amount=total_amount,
        status=InvoiceStatus.SENT,
        notes=invoice_in.notes,
        terms=terms,
        due_date=due_date,
        issued_date=datetime.now()
    )
    
    # Update order status to completed
    order.status = OrderStatus.COMPLETED
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
        if field == "paid_date" and value and db_invoice.status != InvoiceStatus.PAID:
            # Auto-update status to paid when paid_date is set
            db_invoice.status = InvoiceStatus.PAID
        setattr(db_invoice, field, value)
    
    # Recalculate total if amount, tax, or discount changed
    if any(field in update_data for field in ["tax", "discount"]):
        db_invoice.total_amount = db_invoice.amount - db_invoice.discount + db_invoice.tax
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_invoice(db: Session, invoice_id: int) -> dict:
    db_invoice = fetch_invoice_by_id(db, invoice_id=invoice_id)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    
    # Don't allow deletion of paid invoices
    if db_invoice.status == InvoiceStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a paid invoice",
        )
    
    db.delete(db_invoice)
    db.commit()
    return {"detail": "Invoice deleted successfully"}

def mark_invoice_as_paid(db: Session, invoice_id: int) -> Invoice:
    """Mark an invoice as paid"""
    db_invoice = fetch_invoice_by_id(db, invoice_id=invoice_id)
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    
    if db_invoice.status == InvoiceStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice is already paid",
        )
    
    db_invoice.status = InvoiceStatus.PAID
    db_invoice.paid_date = datetime.now()
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_overdue_invoices(db: Session) -> List[Invoice]:
    """Get all overdue invoices"""
    current_date = datetime.now()
    return db.query(Invoice).filter(
        Invoice.due_date < current_date,
        Invoice.status.in_([InvoiceStatus.SENT, InvoiceStatus.DRAFT])
    ).all()

def update_overdue_invoices(db: Session) -> int:
    """Update overdue invoice statuses and return count"""
    current_date = datetime.now()
    overdue_count = db.query(Invoice).filter(
        Invoice.due_date < current_date,
        Invoice.status == InvoiceStatus.SENT
    ).update({"status": InvoiceStatus.OVERDUE})
    
    db.commit()
    return overdue_count