# Clerk Integration Guide

## Overview
The Mediq application now uses Clerk for authentication, providing a secure and user-friendly login experience.

## Features Implemented

### 1. Login Page (`/src/components/Login.jsx`)
- **Clerk SignIn Component**: Integrated Clerk's SignIn component with custom styling
- **Custom Appearance**: Styled to match the application's design with indigo theme
- **Social Authentication**: Supports Google, Facebook, and other providers
- **Email/Password**: Traditional authentication method
- **Responsive Design**: Works on desktop and mobile devices

### 2. Sign-Up Page (`/src/components/SignUp.jsx`)
- **Clerk SignUp Component**: Integrated Clerk's SignUp component
- **Consistent Styling**: Matches the login page design
- **Account Creation**: Handles user registration

### 3. User Profile (`/src/resuables/Header.jsx`)
- **UserButton Component**: Displays user avatar and dropdown menu
- **User Information**: Shows user's name and email
- **Profile Management**: Access to user settings and profile
- **Sign Out**: One-click logout functionality

### 4. Route Protection (`/src/App.jsx`)
- **SignedIn/SignedOut**: Clerk components for route protection
- **Automatic Redirects**: Redirects users based on authentication status
- **Sign-up Route**: Dedicated route for user registration

## How It Works

### Authentication Flow
1. **Unauthenticated Access**: Users see the login page
2. **Sign In**: Users can sign in with email/password or social providers
3. **Sign Up**: New users can create accounts via `/sign-up`
4. **Protected Routes**: Only authenticated users can access the main application
5. **User Profile**: Access profile settings via the user button in the header

### Key Components

```jsx
// Protect routes based on authentication status
<SignedOut>
  <Routes>
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="*" element={<Login />} />
  </Routes>
</SignedOut>

<SignedIn>
  <Layout>
    {/* Protected application routes */}
  </Layout>
</SignedIn>
```

### Custom Styling
The Clerk components are styled using the `appearance` prop to match the application's design:

```jsx
<SignIn 
  appearance={{
    elements: {
      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
      card: 'shadow-none border-0 bg-transparent',
      // ... more styling
    },
  }}
  redirectUrl="/"
  signUpUrl="/sign-up"
/>
```

## Environment Configuration

The application requires the following environment variable:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

This key is already configured in the `.env` file and connects to your Clerk application.

## User Experience

### Login Page
- Clean, professional design with medical theme
- Left side shows medical-themed image
- Right side contains Clerk's sign-in form
- Support for social login buttons
- Responsive layout for all screen sizes

### User Management
- User button in the top-right corner of the header
- Shows user's name and email
- Dropdown menu for profile management
- Easy sign-out functionality

### Security Features
- Secure token management
- Session persistence
- Automatic token refresh
- HTTPS enforcement in production
- CSRF protection

## Development Notes

### Adding New Authentication Features
To add more authentication features:

1. **Multi-Factor Authentication**: Enable in Clerk dashboard
2. **Additional Social Providers**: Configure in Clerk dashboard
3. **Custom Fields**: Add user metadata in Clerk
4. **Webhooks**: Set up for user events

### Customization
You can further customize the authentication experience by:

1. **Styling**: Modify the `appearance` prop in SignIn/SignUp components
2. **Redirects**: Update `redirectUrl` and `signUpUrl` props
3. **User Data**: Access user information via `useUser()` hook
4. **Organization**: Add organization features with Clerk's organization components

## Troubleshooting

### Common Issues
1. **Missing Environment Variable**: Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set
2. **Redirect Issues**: Check redirect URLs in Clerk dashboard
3. **Styling Problems**: Verify Tailwind CSS classes are correctly applied

### Testing
- Test sign-up flow with new accounts
- Verify social login providers work
- Ensure protected routes redirect correctly
- Test sign-out functionality
