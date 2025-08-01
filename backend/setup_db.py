import os
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from databases.database import engine, Base, SessionLocal
from Models.user import User
from Models.customer import Customer
from Models.medicine import Medicine
from Models.stock import Stock
from Models.order import Order, OrderMedicine, OrderStatus
from Models.invoice import Invoice
import random
import hashlib

def get_password_hash(password: str) -> str:
    """Simple password hashing function"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def populate_users(db):
    """Add dummy users with Indian names"""
    users_data = [
        {"username": "admin", "email": "admin@mediq.com", "password": "admin123", "is_admin": True},
        {"username": "rajesh_kumar", "email": "rajesh.kumar@mediq.com", "password": "rajesh123", "is_admin": True},
        {"username": "priya_sharma", "email": "priya.sharma@mediq.com", "password": "priya123", "is_admin": False},
        {"username": "amit_patel", "email": "amit.patel@mediq.com", "password": "amit123", "is_admin": False},
        {"username": "sunita_singh", "email": "sunita.singh@mediq.com", "password": "sunita123", "is_admin": True},
        {"username": "rohit_gupta", "email": "rohit.gupta@mediq.com", "password": "rohit123", "is_admin": False},
        {"username": "kavya_reddy", "email": "kavya.reddy@mediq.com", "password": "kavya123", "is_admin": False},
        {"username": "vikram_joshi", "email": "vikram.joshi@mediq.com", "password": "vikram123", "is_admin": True},
    ]
    
    for user_data in users_data:
        hashed_password = get_password_hash(user_data["password"])
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hashed_password,
            is_admin=user_data["is_admin"]
        )
        db.add(user)
    
    db.commit()
    print(f"Added {len(users_data)} users to the database!")

def populate_customers(db):
    """Add dummy customers with Indian names and addresses"""
    customers_data = [
        {
            "name": "Arjun Mehta",
            "email": "arjun.mehta@gmail.com",
            "phone": "+91-9876543210",
            "address": "123 MG Road, Bengaluru, Karnataka 560001"
        },
        {
            "name": "Deepika Iyer",
            "email": "deepika.iyer@yahoo.com",
            "phone": "+91-9876543211",
            "address": "456 Anna Nagar, Chennai, Tamil Nadu 600040"
        },
        {
            "name": "Ravi Agarwal",
            "email": "ravi.agarwal@hotmail.com",
            "phone": "+91-9876543212",
            "address": "789 Connaught Place, New Delhi, Delhi 110001"
        },
        {
            "name": "Meera Nair",
            "email": "meera.nair@gmail.com",
            "phone": "+91-9876543213",
            "address": "321 Marine Drive, Mumbai, Maharashtra 400001"
        },
        {
            "name": "Karthik Pillai",
            "email": "karthik.pillai@gmail.com",
            "phone": "+91-9876543214",
            "address": "654 Jubilee Hills, Hyderabad, Telangana 500033"
        },
        {
            "name": "Anjali Desai",
            "email": "anjali.desai@gmail.com",
            "phone": "+91-9876543215",
            "address": "987 CG Road, Ahmedabad, Gujarat 380009"
        },
        {
            "name": "Suresh Rao",
            "email": "suresh.rao@gmail.com",
            "phone": "+91-9876543216",
            "address": "147 MG Road, Pune, Maharashtra 411001"
        },
        {
            "name": "Lakshmi Krishnan",
            "email": "lakshmi.krishnan@gmail.com",
            "phone": "+91-9876543217",
            "address": "258 Brigade Road, Bengaluru, Karnataka 560025"
        },
        {
            "name": "Rahul Bhatt",
            "email": "rahul.bhatt@gmail.com",
            "phone": "+91-9876543218",
            "address": "369 Park Street, Kolkata, West Bengal 700016"
        },
        {
            "name": "Neha Kapoor",
            "email": "neha.kapoor@gmail.com",
            "phone": "+91-9876543219",
            "address": "741 Sector 17, Chandigarh, Punjab 160017"
        }
    ]
    
    for customer_data in customers_data:
        customer = Customer(**customer_data)
        db.add(customer)
    
    db.commit()
    print(f"Added {len(customers_data)} customers to the database!")

def populate_medicines(db):
    """Add dummy medicines commonly used in India"""
    medicines_data = [
        {"name": "Paracetamol 500mg", "price": 25.50},
        {"name": "Amoxicillin 250mg", "price": 85.00},
        {"name": "Crocin Advance", "price": 30.00},
        {"name": "Dolo 650", "price": 28.75},
        {"name": "Azithromycin 500mg", "price": 120.00},
        {"name": "Cetirizine 10mg", "price": 45.00},
        {"name": "Omeprazole 20mg", "price": 65.00},
        {"name": "Metformin 500mg", "price": 55.00},
        {"name": "Amlodipine 5mg", "price": 75.00},
        {"name": "Atorvastatin 10mg", "price": 95.00},
        {"name": "Ibuprofen 400mg", "price": 40.00},
        {"name": "Aspirin 75mg", "price": 20.00},
        {"name": "Cough Syrup Benadryl", "price": 85.00},
        {"name": "Vitamin D3 Tablets", "price": 180.00},
        {"name": "Iron Folic Acid", "price": 35.00},
        {"name": "Calcium Carbonate", "price": 60.00},
        {"name": "Digene Gel", "price": 45.00},
        {"name": "Volini Gel", "price": 125.00},
        {"name": "Betadine Antiseptic", "price": 95.00},
        {"name": "Glucon-D Orange", "price": 150.00}
    ]
    
    for medicine_data in medicines_data:
        medicine = Medicine(**medicine_data)
        db.add(medicine)
    
    db.commit()
    print(f"Added {len(medicines_data)} medicines to the database!")

def populate_stock(db):
    """Add stock data for medicines"""
    medicines = db.query(Medicine).all()
    admin_users = db.query(User).filter(User.is_admin == True).all()
    
    batch_prefixes = ["BTC", "MED", "PHM", "DRG", "RX"]
    
    for medicine in medicines:
        # Generate random expiry date (6 months to 2 years from now)
        expiry_date = datetime.now() + timedelta(days=random.randint(180, 730))
        
        # Generate random batch number
        batch_number = f"{random.choice(batch_prefixes)}{random.randint(1000, 9999)}"
        
        stock = Stock(
            medicine_id=medicine.id,
            quantity=random.randint(50, 500),
            batch_number=batch_number,
            expiry_date=expiry_date,
            admin_id=random.choice(admin_users).id
        )
        db.add(stock)
    
    db.commit()
    print(f"Added stock data for {len(medicines)} medicines!")

def populate_orders_and_invoices(db):
    """Add dummy orders and invoices"""
    customers = db.query(Customer).all()
    medicines = db.query(Medicine).all()
    users = db.query(User).all()
    
    order_statuses = [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED]
    
    for i in range(15):  # Create 15 orders
        customer = random.choice(customers)
        order_date = datetime.now() - timedelta(days=random.randint(1, 30))
        
        order = Order(
            customer_id=customer.id,
            order_date=order_date,
            status=random.choice(order_statuses)
        )
        db.add(order)
        db.flush()  # To get the order ID
        
        # Add 1-5 medicines to each order
        total_amount = 0
        num_medicines = random.randint(1, 5)
        selected_medicines = random.sample(medicines, num_medicines)
        
        for medicine in selected_medicines:
            quantity = random.randint(1, 10)
            unit_price = medicine.price
            
            order_medicine = OrderMedicine(
                order_id=order.id,
                medicine_id=medicine.id,
                quantity=quantity,
                unit_price=unit_price
            )
            db.add(order_medicine)
            total_amount += quantity * unit_price
        
        order.total_amount = total_amount
        
        # Create invoice for completed orders
        if order.status == OrderStatus.COMPLETED:
            tax = total_amount * 0.18  # 18% GST
            total_with_tax = total_amount + tax
            
            invoice = Invoice(
                invoice_number=f"INV-{order.id:04d}-{datetime.now().year}",
                order_id=order.id,
                user_id=random.choice(users).id,
                amount=total_amount,
                tax=tax,
                total_amount=total_with_tax,
                created_at=order_date + timedelta(hours=1)
            )
            db.add(invoice)
    
    db.commit()
    print("Added orders and invoices to the database!")

def setup_database():
    """Main function to set up the database with dummy data"""
    print("Setting up Mediq database with dummy data...")
    
    # Create database tables
    create_tables()
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already contains data. Skipping setup...")
            return
        
        # Populate tables in order (respecting foreign key constraints)
        populate_users(db)
        populate_customers(db)
        populate_medicines(db)
        populate_stock(db)
        populate_orders_and_invoices(db)
        
        print("\n✅ Database setup completed successfully!")
        print("\nDefault admin credentials:")
        print("Username: admin")
        print("Password: admin123")
        print("\nOther test users:")
        print("Username: rajesh_kumar, Password: rajesh123 (Admin)")
        print("Username: priya_sharma, Password: priya123 (User)")
        print("Username: sunita_singh, Password: sunita123 (Admin)")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_database()
