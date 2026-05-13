import os

from fastapi import FastAPI
from databases.database import Base, engine
from Routes import medicine,order,customer,stock,user,invoice
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


def _cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "").strip()
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    # Reasonable local defaults
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
    ]


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Ensure DB tables exist (safe to run repeatedly)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}

# Include routes
app.include_router(medicine.router, prefix="/medicines", tags=["Medicine"])
app.include_router(order.router, prefix="/orders", tags=["Order"])
app.include_router(customer.router, prefix="/customers", tags=["Customer"])
app.include_router(stock.router, prefix="/stocks", tags=["Stock"])
app.include_router(user.router, prefix="/users", tags=["User"])
app.include_router(invoice.router, prefix="/invoices", tags=["Invoice"])