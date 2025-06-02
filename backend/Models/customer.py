from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from databases.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    address = Column(String)
    
    # Define relationships
    orders = relationship("Order", back_populates="customer")
