import os
# from sqlalchemy import inspect
from databases.database import engine, Base
# from models.medicine import Medicine
# from models.order import Order, OrderMedicine

def delete_database():
    db_path = "medicines.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Database '{db_path}' has been deleted.")
    else:
        print(f"Database '{db_path}' does not exist.")

if __name__ == "__main__":
    delete_database()
    pass