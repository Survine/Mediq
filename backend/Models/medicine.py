from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from databases.database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)

    # Define relationships
    order_medicines = relationship("OrderMedicine", back_populates="medicine")
    stock = relationship("Stock", back_populates="medicine", uselist=False)


    # relationships are created so that we can access the data from the other tables using orm like order_medicines.medicine
    # and medicine.order_medicines