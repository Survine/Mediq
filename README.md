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
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Main application components
│   ├── Login.jsx      # Clerk-integrated login page
│   ├── SignUp.jsx     # Clerk-integrated sign-up page
│   └── ...
├── resuables/         # Reusable UI components
│   ├── Header.jsx     # Header with user profile
│   └── ...
├── hooks/             # Custom React hooks
├── services/          # API services
└── assets/            # Static assets
```

## Technologies Used

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Clerk
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Backend**: FastAPI (Python)
- **Database**: SQLite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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
