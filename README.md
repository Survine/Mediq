# Mediq - Medicine Management System

A modern medicine management system built with React, Vite, and integrated with Clerk for authentication.

## Features

- 🏥 **Medicine Management**: Track medicines, inventory, and stock levels
- 👥 **Customer Management**: Manage customer information and orders
- 📋 **Order Processing**: Handle medicine orders and invoices
- 🔐 **Secure Authentication**: Powered by Clerk with social login support
- 👤 **User Management**: Role-based access control
- 📊 **Dashboard**: Overview of key metrics and activities

## Authentication

This application uses [Clerk](https://clerk.com/) for authentication, providing:

- **Email/Password Authentication**: Traditional login with email and password
- **Social Login**: Sign in with Google, Facebook, and other providers
- **User Profile Management**: Built-in user profile and settings
- **Secure Sessions**: Automatic session management and token refresh

### Setting Up Clerk

1. Create a Clerk account at [https://clerk.com/](https://clerk.com/)
2. Create a new application in your Clerk dashboard
3. Copy your Publishable Key from the Clerk dashboard
4. Update the `.env` file with your Clerk configuration:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Set up environment variables (see `frontend/.env.example`)
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
frontend/
└── src/
   ├── components/         # Main application components
   ├── resuables/          # Reusable UI components
   ├── hooks/              # Custom React hooks
   ├── services/           # API services
   └── assets/             # Static assets

backend/
├── main.py                 # FastAPI entrypoint
├── Routes/                 # API routers
├── Models/                 # SQLAlchemy models
└── databases/              # DB engine + sessions
```

## Technologies Used

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Clerk
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Backend**: FastAPI (Python)
- **Database**: SQLite

## Available Scripts

- `npm run dev` - Start frontend dev server (run inside `frontend/`)
- `npm run build` - Build frontend for production (run inside `frontend/`)
- `npm run lint` - Run ESLint (run inside `frontend/`)
- `npm run preview` - Preview frontend production build (run inside `frontend/`)

## Split Deploy (Industry-Style)

This repo is set up for a common real-world deployment style:

- **Frontend**: Vite static site (Vercel / Netlify / Render Static Site)
- **Backend**: FastAPI web service (Render / Railway / Fly)

### Frontend (Vercel)

1. Import the repo into Vercel.
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
4. Configure environment variables:
   - `VITE_API_BASE_URL` = your deployed backend URL (example: `https://mediq-api.onrender.com`)
   - `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key

### Backend (Render)

This repo includes a minimal `render.yaml` for the API.

1. Create a new **Web Service** on Render and connect your repo.
2. Render will detect `render.yaml` (or you can set manually):
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Set backend environment variables:
   - `CORS_ORIGINS` = your frontend origin(s), comma-separated
     - Example: `https://your-frontend.vercel.app`
   - Optional: `DATABASE_URL` (defaults to SQLite under `backend/data/mediq.db`)

### Local Dev (Frontend + Backend)

Backend:

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Frontend (in another terminal):

```bash
cd frontend
npm install
npm run dev
```

By default the frontend uses `/api` and Vite proxies to `http://localhost:8000`.

## Authentication Flow

1. **Unauthenticated users** see the login page with Clerk's SignIn component
2. **First-time users** can access the sign-up page via the "/sign-up" route
3. **Authenticated users** are redirected to the main dashboard
4. **User profile** is accessible via the user button in the header
5. **Sign out** is handled through Clerk's UserButton component

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
