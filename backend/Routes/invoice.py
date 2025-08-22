from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from databases.database import get_db

from Models.invoice import Invoice
from Schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceOut, InvoiceWithDetails, InvoicePrintData
from Views.invoice import (
    fetch_invoice_by_id,
    fetch_invoice_by_order_id,
    fetch_all_invoices,
    create_invoice,
    update_invoice,
    delete_invoice,
    fetch_invoice_with_details,
    mark_invoice_as_paid,
    get_overdue_invoices,
    update_overdue_invoices,
)

router = APIRouter()

@router.get("/", response_model=List[InvoiceOut])
def get_all_invoices(db: Session = Depends(get_db)) -> List[InvoiceOut]:
    """Get all invoices"""
    return fetch_all_invoices(db)

@router.get("/overdue", response_model=List[InvoiceOut])
def get_overdue_invoices_route(db: Session = Depends(get_db)) -> List[InvoiceOut]:
    """Get all overdue invoices"""
    # Update overdue statuses first
    update_overdue_invoices(db)
    return get_overdue_invoices(db)

@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice_by_id(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    """Get invoice by ID"""
    invoice = fetch_invoice_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.get("/order/{order_id}", response_model=InvoiceOut)
def get_invoice_by_order_id(order_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    """Get invoice by order ID"""
    invoice = fetch_invoice_by_order_id(db, order_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.get("/{invoice_id}/details", response_model=InvoiceWithDetails)
def get_invoice_details(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceWithDetails:
    """Get detailed invoice information including customer and order details"""
    invoice = fetch_invoice_with_details(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice

@router.get("/{invoice_id}/print-data", response_model=InvoicePrintData)
def get_invoice_print_data(invoice_id: int, db: Session = Depends(get_db)) -> InvoicePrintData:
    """Get invoice data formatted for printing"""
    invoice_details = fetch_invoice_with_details(db, invoice_id)
    if not invoice_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    
    return InvoicePrintData(invoice=invoice_details)

@router.get("/{invoice_id}/print", response_class=HTMLResponse)
def get_invoice_html(invoice_id: int, db: Session = Depends(get_db)) -> str:
    """Get invoice as HTML for printing"""
    invoice_details = fetch_invoice_with_details(db, invoice_id)
    if not invoice_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    
    # Generate HTML invoice
    html_content = generate_invoice_html(invoice_details)
    return html_content

@router.post("/", response_model=InvoiceOut)
def create_new_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), user_id: int = 1) -> InvoiceOut:
    """Create a new invoice"""
    return create_invoice(db, invoice, user_id)

@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_existing_invoice(invoice_id: int, invoice: InvoiceUpdate, db: Session = Depends(get_db)) -> InvoiceOut:
    """Update an existing invoice"""
    return update_invoice(db, invoice_id, invoice)

@router.post("/{invoice_id}/mark-paid", response_model=InvoiceOut)
def mark_as_paid(invoice_id: int, db: Session = Depends(get_db)) -> InvoiceOut:
    """Mark an invoice as paid"""
    return mark_invoice_as_paid(db, invoice_id)

@router.delete("/{invoice_id}")
def delete_existing_invoice(invoice_id: int, db: Session = Depends(get_db)) -> dict:
    """Delete an invoice"""
    result = delete_invoice(db, invoice_id)
    return result

def generate_invoice_html(invoice: InvoiceWithDetails) -> str:
    """Generate HTML content for invoice printing"""
    
    # Calculate subtotal
    subtotal = sum(item.total_price for item in invoice.order_medicines)
    
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #{invoice.invoice_number}</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                line-height: 1.6;
            }}
            .invoice-container {{
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #2563eb;
            }}
            .company-info h1 {{
                color: #2563eb;
                margin: 0;
                font-size: 28px;
            }}
            .company-info p {{
                margin: 5px 0;
                color: #666;
            }}
            .invoice-title {{
                text-align: right;
            }}
            .invoice-title h2 {{
                color: #2563eb;
                margin: 0;
                font-size: 24px;
            }}
            .invoice-details {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }}
            .section h3 {{
                color: #2563eb;
                margin-bottom: 10px;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .info-table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }}
            .info-table th,
            .info-table td {{
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }}
            .info-table th {{
                background-color: #f8fafc;
                font-weight: 600;
                color: #374151;
            }}
            .amount-column {{
                text-align: right !important;
            }}
            .totals {{
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
            }}
            .totals-table {{
                width: 300px;
                margin-left: auto;
                border-collapse: collapse;
            }}
            .totals-table td {{
                padding: 8px 12px;
                border: none;
            }}
            .totals-table .total-row {{
                font-weight: bold;
                font-size: 18px;
                color: #2563eb;
                border-top: 2px solid #2563eb;
            }}
            .notes {{
                margin-top: 30px;
                padding: 20px;
                background-color: #f8fafc;
                border-radius: 6px;
            }}
            .notes h4 {{
                margin-top: 0;
                color: #374151;
            }}
            .footer {{
                margin-top: 40px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }}
            .status {{
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }}
            .status-paid {{
                background-color: #d1fae5;
                color: #065f46;
            }}
            .status-sent {{
                background-color: #dbeafe;
                color: #1e40af;
            }}
            .status-overdue {{
                background-color: #fee2e2;
                color: #991b1b;
            }}
            .status-draft {{
                background-color: #f3f4f6;
                color: #374151;
            }}
            @media print {{
                body {{
                    padding: 0;
                }}
                .invoice-container {{
                    box-shadow: none;
                    padding: 0;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Header -->
            <div class="header">
                <div class="company-info">
                    <h1>MediQ Pharmacy</h1>
                    <p>123 Health Street, Medical City, MC 12345</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Email: info@mediq.com</p>
                    <p>Website: www.mediq.com</p>
                </div>
                <div class="invoice-title">
                    <h2>INVOICE</h2>
                    <p><strong>{invoice.invoice_number}</strong></p>
                    <span class="status status-{invoice.status.value}">{invoice.status.value}</span>
                </div>
            </div>
            
            <!-- Invoice Details -->
            <div class="invoice-details">
                <div class="section">
                    <h3>Bill To:</h3>
                    <p><strong>{invoice.customer_name}</strong></p>
                    {f'<p>{invoice.customer_email}</p>' if invoice.customer_email else ''}
                    {f'<p>{invoice.customer_phone}</p>' if invoice.customer_phone else ''}
                    {f'<p>{invoice.customer_address}</p>' if invoice.customer_address else ''}
                </div>
                <div class="section">
                    <h3>Invoice Information:</h3>
                    <p><strong>Invoice Date:</strong> {invoice.issued_date.strftime('%B %d, %Y')}</p>
                    {f'<p><strong>Due Date:</strong> {invoice.due_date.strftime("%B %d, %Y")}</p>' if invoice.due_date else ''}
                    <p><strong>Order ID:</strong> #{invoice.order_id}</p>
                    <p><strong>Order Date:</strong> {invoice.order_date.strftime('%B %d, %Y')}</p>
                    {f'<p><strong>Payment Date:</strong> {invoice.paid_date.strftime("%B %d, %Y")}</p>' if invoice.paid_date else ''}
                </div>
            </div>
            
            <!-- Items Table -->
            <table class="info-table">
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th class="amount-column">Unit Price</th>
                        <th class="amount-column">Total</th>
                    </tr>
                </thead>
                <tbody>
    """
    
    # Add items
    for item in invoice.order_medicines:
        html += f"""
                    <tr>
                        <td>{item.medicine_name}</td>
                        <td>{item.quantity}</td>
                        <td class="amount-column">${item.unit_price:.2f}</td>
                        <td class="amount-column">${item.total_price:.2f}</td>
                    </tr>
        """
    
    html += f"""
                </tbody>
            </table>
            
            <!-- Totals -->
            <div class="totals">
                <table class="totals-table">
                    <tr>
                        <td>Subtotal:</td>
                        <td class="amount-column">${subtotal:.2f}</td>
                    </tr>
    """
    
    if invoice.discount > 0:
        html += f"""
                    <tr>
                        <td>Discount:</td>
                        <td class="amount-column">-${invoice.discount:.2f}</td>
                    </tr>
        """
    
    if invoice.tax > 0:
        html += f"""
                    <tr>
                        <td>Tax:</td>
                        <td class="amount-column">${invoice.tax:.2f}</td>
                    </tr>
        """
    
    html += f"""
                    <tr class="total-row">
                        <td>Total Amount:</td>
                        <td class="amount-column">${invoice.total_amount:.2f}</td>
                    </tr>
                </table>
            </div>
    """
    
    # Add notes if available
    if invoice.notes:
        html += f"""
            <div class="notes">
                <h4>Notes:</h4>
                <p>{invoice.notes}</p>
            </div>
        """
    
    # Add terms if available
    if invoice.terms:
        html += f"""
            <div class="notes">
                <h4>Terms & Conditions:</h4>
                <p>{invoice.terms}</p>
            </div>
        """
    
    html += """
            <!-- Footer -->
            <div class="footer">
                <p>Thank you for your business!</p>
                <p>If you have any questions about this invoice, please contact us at info@mediq.com</p>
            </div>
        </div>
        
        <script>
            // Auto-print when opened in new window
            window.onload = function() {
                if (window.location.search.includes('print=true')) {
                    window.print();
                }
            }
        </script>
    </body>
    </html>
    """
    
    return html
