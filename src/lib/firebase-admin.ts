import { initializeApp, getApps, cert, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

// Initialize Firebase Admin (server-side only)
export function getAdminApp(): App {
  if (!adminApp) {
    const apps = getApps();
    if (apps.length > 0) {
      adminApp = apps[0];
      return adminApp;
    }

    try {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID not configured');
      }

      if (serviceAccount) {
        // Production: Use service account JSON from environment
        console.log('🔑 Firebase Admin: Using service account credentials');
        adminApp = initializeApp({
          credential: cert(JSON.parse(serviceAccount)),
          projectId,
        });
      } else {
        // Development: Use application default credentials
        console.log('🔑 Firebase Admin: Using application default credentials (development)');
        adminApp = initializeApp({
          credential: applicationDefault(),
          projectId,
        });
      }
      
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error: any) {
      console.error('❌ Firebase Admin initialization failed:', error.message);
      
      // Last resort: Initialize without credentials (will fail on actual Firestore operations)
      // This allows the app to start but operations will fail with better error messages
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        console.warn('⚠️  Initializing Firebase Admin without credentials - operations will fail');
        adminApp = initializeApp({ projectId });
      } else {
        throw new Error('Cannot initialize Firebase Admin: No credentials or project ID available');
      }
    }
  }
  
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}
