import os
from databases.database import engine, Base

def delete_database():
    db_path = r"D:\Mediq\backend\medicines.db"
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"✅ Database '{db_path}' has been deleted.")
            return True
        except PermissionError:
            print(f"❌ Cannot delete database '{db_path}' - file is in use by another process.")
            print("Please stop the FastAPI server and try again.")
            return False
        except Exception as e:
            print(f"❌ Error deleting database: {e}")
            return False
    else:
        print(f"Database '{db_path}' does not exist.")
        return True

def create_new_database():
    """Create new database with updated schema"""
    try:
        print("Creating new database with updated schema...")
        Base.metadata.create_all(bind=engine)
        print("✅ New database created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def recreate_database():
    """Delete and recreate database"""
    print("=== Recreating MediQ Database ===\n")
    
    if delete_database():
        if create_new_database():
            print("\n🎉 Database recreated successfully!")
            print("You can now:")
            print("1. Restart your FastAPI server")
            print("2. Run 'python setup_db.py' to populate with sample data")
            return True
        else:
            print("\n❌ Failed to create new database")
            return False
    else:
        print("\n❌ Failed to delete existing database")
        return False

if __name__ == "__main__":
    recreate_database()