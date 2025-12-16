import { storage } from './firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { TransformationType } from '@/types';

export interface TransformationHistory {
  id: string;
  originalImage: string; // base64 or URL
  transformedImage: string; // base64 or URL
  transformationType: TransformationType;
  timestamp: number;
  firebaseUrl?: string; // Firebase Storage URL (if uploaded)
  expiresAt: number; // When to delete from Firebase (7 days)
}

const HISTORY_KEY = 'transformation_history';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Get all transformation history from localStorage
 */
export const getHistory = (): TransformationHistory[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    
    const history: TransformationHistory[] = JSON.parse(stored);
    return history.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

/**
 * Save transformation to localStorage and Firebase Storage
 */
export const saveToHistory = async (
  originalImage: string,
  transformedImage: string,
  transformationType: TransformationType
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const id = `${transformationType}_${now}`;
  const expiresAt = now + SEVEN_DAYS_MS;

  let firebaseUrl: string | undefined;

  // Try to upload to Firebase Storage
  try {
    if (storage) {
      const storageRef = ref(storage, `transformations/${id}.txt`);
      
      // Store as JSON string
      const dataToUpload = JSON.stringify({
        original: originalImage,
        transformed: transformedImage,
        type: transformationType,
      });
      
      await uploadString(storageRef, dataToUpload, 'raw');
      firebaseUrl = await getDownloadURL(storageRef);
      
      console.log('Uploaded to Firebase Storage:', id);
    }
  } catch (error) {
    console.warn('Failed to upload to Firebase Storage:', error);
    // Continue without Firebase URL - will use base64 in localStorage
  }

  const newEntry: TransformationHistory = {
    id,
    originalImage,
    transformedImage,
    transformationType,
    timestamp: now,
    firebaseUrl,
    expiresAt,
  };

  // Add to localStorage
  const history = getHistory();
  history.unshift(newEntry); // Add to beginning

  // Keep only last 50 items to prevent localStorage overflow
  const trimmedHistory = history.slice(0, 50);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    console.log('Saved to history:', id);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    // If localStorage is full, try removing old items
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      const reducedHistory = history.slice(0, 20); // Keep only 20 most recent
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(reducedHistory));
      } catch (retryError) {
        console.error('Still failed after reducing history:', retryError);
      }
    }
  }
};

/**
 * Delete expired items from Firebase Storage
 */
export const cleanupExpiredHistory = async (): Promise<void> => {
  if (typeof window === 'undefined' || !storage) return;

  const history = getHistory();
  const now = Date.now();
  let hasChanges = false;

  for (const item of history) {
    // If expired and has Firebase URL, delete from Firebase
    if (item.expiresAt < now && item.firebaseUrl) {
      try {
        const storageRef = ref(storage, `transformations/${item.id}.txt`);
        await deleteObject(storageRef);
        console.log('Deleted expired from Firebase:', item.id);
        
        // Remove Firebase URL but keep in localStorage
        item.firebaseUrl = undefined;
        hasChanges = true;
      } catch (error) {
        console.warn('Failed to delete from Firebase:', error);
      }
    }
  }

  // Update localStorage if we made changes
  if (hasChanges) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to update history after cleanup:', error);
    }
  }
};

/**
 * Delete a specific item from history
 */
export const deleteFromHistory = async (id: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  const history = getHistory();
  const item = history.find(h => h.id === id);

  // Delete from Firebase if exists
  if (item?.firebaseUrl && storage) {
    try {
      const storageRef = ref(storage, `transformations/${id}.txt`);
      await deleteObject(storageRef);
      console.log('Deleted from Firebase:', id);
    } catch (error) {
      console.warn('Failed to delete from Firebase:', error);
    }
  }

  // Remove from localStorage
  const updatedHistory = history.filter(h => h.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('Deleted from history:', id);
  } catch (error) {
    console.error('Failed to delete from history:', error);
  }
};

/**
 * Clear all history
 */
export const clearAllHistory = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const history = getHistory();

  // Delete all from Firebase
  if (storage) {
    for (const item of history) {
      if (item.firebaseUrl) {
        try {
          const storageRef = ref(storage, `transformations/${item.id}.txt`);
          await deleteObject(storageRef);
        } catch (error) {
          console.warn('Failed to delete from Firebase:', item.id, error);
        }
      }
    }
  }

  // Clear localStorage
  try {
    localStorage.removeItem(HISTORY_KEY);
    console.log('Cleared all history');
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

/**
 * Get history count
 */
export const getHistoryCount = (): number => {
  return getHistory().length;
};

// Run cleanup on module load
if (typeof window !== 'undefined') {
  cleanupExpiredHistory().catch(console.error);
}
