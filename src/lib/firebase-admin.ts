import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

// Initialize Firebase Admin (server-side only)
export function getAdminApp() {
  if (!adminApp) {
    // Check if already initialized
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      // Initialize with service account or project ID
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Firebase project ID not configured');
      }

      // For deployed environments, use service account JSON
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      if (serviceAccount) {
        // Production: Use service account credentials
        adminApp = initializeApp({
          credential: cert(JSON.parse(serviceAccount)),
        });
      } else {
        // Development: Use project ID (works with emulator or default credentials)
        adminApp = initializeApp({
          projectId,
        });
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
