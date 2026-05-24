# Mediq

**Mediq** is a comprehensive Medicine Inventory Management and Billing System designed to streamline pharmacy operations. It provides a robust suite of tools for managing medicines, tracking stock levels, handling customer orders, and generating professional invoices, all secured by modern authentication.

![Mediq Dashboard](https://via.placeholder.com/1000x500.png?text=Mediq+Dashboard) *Replace this placeholder with a screenshot of your dashboard.*

## Features

- 💊 **Medicine Management**: Add, update, and categorize medicine details efficiently.
- 📦 **Stock Tracking**: Monitor inventory levels in real-time to prevent shortages or overstocking.
- 👥 **Customer Management**: Maintain a secure database of customer profiles and purchase histories.
- 🛒 **Order Processing**: Create and manage customer orders seamlessly.
- 🧾 **Billing & Invoicing**: Automatically generate accurate, professional invoices for transactions.
- 🔐 **Secure Authentication**: Integrated with [Clerk](https://clerk.com/) for secure user sign-up, login, and route protection.
- 📱 **Responsive UI**: A modern, mobile-friendly interface built with Tailwind CSS.

## Tech Stack

### Frontend
- **Framework**: React 19 via Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Authentication**: Clerk React SDK
- **Icons**: Lucide React & React Icons

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy (SQLite by default, configurable)
- **Server**: Uvicorn

### Deployment
- Configured for easy deployment on **Render** using the included `render.yaml`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.11+)
- A [Clerk](https://clerk.com/) account for authentication keys.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mediq.git
cd mediq
```

### 2. Backend Setup

Open a terminal in the `backend` directory:

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API will be available at `http://localhost:8000` and Swagger UI at `http://localhost:8000/docs`.*

### 3. Frontend Setup

Open a new terminal in the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Create environment variables file
# Add your Clerk Publishable Key: VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
cp .env.example .env

# Start the Vite development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Backend (`backend/.env` - optional)
```env
CORS_ORIGINS=http://localhost:5173
# DATABASE_URL=sqlite:///./mediq.db
```

## Deployment

The repository includes a `render.yaml` file for seamless deployment as a Web Service on Render. 
1. Connect your repository to Render.
2. Select **Blueprint** and use the `render.yaml`.
3. Set your `CORS_ORIGINS` and `PYTHON_VERSION` in the Render dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
