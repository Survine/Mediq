from fastapi import FastAPI
from databases.database import Base, engine
from Routes import medicine,order,customer,stock,user,invoice
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(medicine.router, prefix="/medicines", tags=["Medicine"])
app.include_router(order.router, prefix="/orders", tags=["Order"])
app.include_router(customer.router, prefix="/customers", tags=["Customer"])
app.include_router(stock.router, prefix="/stocks", tags=["Stock"])
app.include_router(user.router, prefix="/users", tags=["User"])
app.include_router(invoice.router, prefix="/invoices", tags=["Invoice"])