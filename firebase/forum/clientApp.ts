import { auth, firestore, storage } from "@/lib/firebase";

/**
 * Re-exports Firebase services from the unified central configuration in @/lib/firebase.
 * This ensures that only one instance of Firebase is initialized across the entire application,
 * preventing race conditions and 'INTERNAL ASSERTION FAILED' errors in Firebase Auth.
 */
export { auth, firestore, storage };
