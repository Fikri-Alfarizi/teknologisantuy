'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Synchronizes user authentication state with a detailed user profile in Firestore.
   * If a profile doesn't exist, it creates a default one.
   * @param {Object} firebaseUser - The authenticated user object from Firebase Auth.
   */
  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Santuy User',
          photoURL: firebaseUser.photoURL || null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isAnonymous: firebaseUser.isAnonymous,
          bio: '',
          role: 'user', // Default role. Admin must be set manually in DB.
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('[AUTH_CONTEXT_SYNC_ERROR]:', err);
      // We don't set global error here to avoid blocking the whole app 
      // if it's just a profile fetch failure, unless critical.
      if (err.code === 'permission-denied') {
        console.warn('Firestore Permission Denied. You might need to update your Security Rules.');
      }
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up dengan email dan password
  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name di Firebase Auth
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // syncUserProfile will be triggered by onAuthStateChanged, 
      // but we can call it here too to ensure profile exists immediately.
      await syncUserProfile(result.user);
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login dengan email dan password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login dengan Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      // Tambahkan prompt select_account jika ingin memudahkan ganti akun
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      
      // We no longer manually setDoc here as onAuthStateChanged handles it via syncUserProfile.
      // This solves the 'permission-denied' race condition that often occurs
      // when trying to write to Firestore before Auth state is fully propagated.
      
      return result.user;
    } catch (err) {
      // provide cleaner error for permission-denied
      if (err.code === 'permission-denied') {
        setError('Missing or insufficient permissions to access profile database.');
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  // Login sebagai Anonymous
  const signInAsAnonymous = async () => {
    try {
      setError(null);
      const result = await signInAnonymously(auth);
      await syncUserProfile(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile (Firestore & Firebase Auth)
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (!user) throw new Error('Must be logged in to update profile');

      // Update Firebase Auth object if needed
      if (updates.displayName || updates.photoURL) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(userRef, updateData, { merge: true });
      
      // Refresh local profile state
      const refreshedSnap = await getDoc(userRef);
      if (refreshedSnap.exists()) {
        setUserProfile(refreshedSnap.data());
      }
      
      return updateData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInAsAnonymous,
    signOut,
    updateUserProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

