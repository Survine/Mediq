# Mediq

Mediq is a full-stack pharmacy operations and billing dashboard. I developed this project to model a real-world software solution for retail pharmacies, dealing with the practical challenges of inventory tracking, order management, and straightforward invoicing. 

The application utilizes a decoupled architecture, pairing a React 19 frontend with a FastAPI backend to deliver a fast, responsive user experience backed by a robust and type-safe API.

### Live Environments
- **Frontend App:** [mediq-inky.vercel.app](https://mediq-inky.vercel.app/)
- **API Documentation:** [mediq-94f4.onrender.com/docs](https://mediq-94f4.onrender.com/docs)

---

## Technical Stack

**Frontend**
- **React 19:** Function components, hooks, and modern React patterns.
- **Vite:** Aggressive build tooling and hot module replacement.
- **Tailwind CSS v4:** Utility-first styling for a custom, maintainable design system.
- **React Router:** Client-side routing for navigating the dashboard.
- **Clerk:** Authentication handles user identity and session management securely.

**Backend**
- **Python 3.10+ / FastAPI:** High performance, asynchronous web framework.
- **Pydantic:** Type enforcement and data validation on incoming payloads.
- **SQLAlchemy:** SQL toolkit and Object-Relational Mapper (ORM).
- **SQLite:** Lightweight local persistence, configured through connection strings for an easy eventual migration to PostgreSQL.

---

## Features

- **Inventory Tracking:** Manage medicine stocks, update pricing, and track expiration dates to prevent inventory loss.
- **Customer Directory:** Maintain records of customers to associate with transaction histories.
- **Order Pipeline:** Select medicines, specify quantities, and record the cart contents as a finalized order.
- **Invoicing System:** Convert orders into printable invoices, with status tracking indicating whether a bill is pending, paid, or overdue.
- **Secure Access:** Dashboard endpoints and API routes are protected behind Clerk authentication, ensuring only authorized personnel have access to business data.

---

## Project Structure

```text
Mediq/
├── backend/                  # FastAPI Application
│   ├── main.py               # Application entry point and configuration
│   ├── Routes/               # API endpoint definitions 
│   ├── Models/               # SQLAlchemy database models
│   ├── Schemas/              # Pydantic validation schemas
│   └── data/                 # SQLite database storage (local)
│
└── frontend/                 # React UI
    ├── vite.config.js        # Vite bundler configuration
    ├── src/App.jsx           # Main React component and router
    ├── src/components/       # High-level page components (Medicines, Layouts)
    ├── src/inputforms/       # Dedicated form components for data entry
    └── src/services/         # API abstraction layer
```

---

## Local Development Setup

To run Mediq locally, you will need to start both the Python backend service and the Node front-end server.

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)

### 1. Starting the Backend

The FastApi backend runs on port 8000. It requires a virtual environment to isolate dependencies.

```bash
cd backend
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On MacOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Once running, you can view the automatically generated Swagger API documentation at `http://localhost:8000/docs`.

### 2. Starting the Frontend

The Vite frontend runs on port 5173.

```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

You can view the React application at `http://localhost:5173`.

---

## Environment Configuration

Both the frontend and backend require a `.env` file at the root of their respective directories.

**frontend/.env**
```env
# Clerk public API key for authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# URL pointing to the backend API service
VITE_API_BASE_URL=http://localhost:8000
```

**backend/.env**
```env
# Origins allowed to make requests to the API (e.g. the React dev server)
CORS_ORIGINS=http://localhost:5173,https://mediq-inky.vercel.app

# Database connection string
DATABASE_URL=sqlite:///./data/mediq.db
```