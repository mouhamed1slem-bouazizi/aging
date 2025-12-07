# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter a project name (e.g., "AI Portrait Studio")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (</>)
2. Register your app with a nickname (e.g., "AI Portrait Studio Web")
3. You'll see your Firebase configuration - **copy these values**

## Step 3: Enable Authentication Methods

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click, toggle "Enable", and save
   - **Google**: Click, toggle "Enable", add your email as project support email, and save

## Step 4: Configure Environment Variables

Update your `.env.local` file with the values from Step 2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication > Settings**
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (should already be there)
   - Your production domain when you deploy

## Step 6: Test the Authentication

1. Restart your development server
2. Navigate to `/auth/signup`
3. Create a test account
4. Try signing in with the created account
5. Try Google sign-in

## Features Implemented

✅ Email/Password Sign Up
✅ Email/Password Sign In
✅ Google Sign In
✅ Protected Routes (Transform page requires authentication)
✅ User Profile Display in Header
✅ Sign Out Functionality
✅ Automatic redirect to sign-in for unauthenticated users
✅ Loading states during authentication

## File Structure

```
src/
├── lib/
│   └── firebase.ts              # Firebase configuration
├── contexts/
│   └── AuthContext.tsx          # Authentication context and hooks
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx      # Sign-in page
│   │   └── signup/page.tsx      # Sign-up page
│   └── layout.tsx               # Updated with AuthProvider
```

## Important Notes

- Users MUST sign in/sign up to access the Transform page
- Firebase will handle password security and user management
- Google sign-in provides a seamless one-click authentication
- All authentication state is managed globally via React Context
- The app automatically redirects unauthenticated users to `/auth/signin`
