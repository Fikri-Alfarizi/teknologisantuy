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
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user profile from Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserProfile(userSnap.data());
          } else {
            // Buat profile baru jika belum ada
            const newProfile = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || 'Anonymous User',
              photoURL: currentUser.photoURL || null,
              createdAt: new Date(),
              isAnonymous: currentUser.isAnonymous,
              bio: '',
              role: 'user',
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
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
      
      // Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Create user profile di Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        createdAt: new Date(),
        isAnonymous: false,
        bio: '',
        role: 'user',
      });
      
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
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          isAnonymous: false,
          bio: '',
          role: 'user',
        });
      }
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login sebagai Anonymous
  const signInAsAnonymous = async () => {
    try {
      setError(null);
      const result = await signInAnonymously(auth);
      
      // Create anonymous user profile
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: null,
        displayName: `Guest_${Math.random().toString(36).substr(2, 9)}`,
        photoURL: null,
        createdAt: new Date(),
        isAnonymous: true,
        bio: '',
        role: 'user',
      });
      
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
      // Update Firebase Auth object if needed
      if (user && (updates.displayName || updates.photoURL)) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
        // Force refresh user state somehow, but onAuthStateChanged will catch next reload.
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...userProfile,
        ...updates,
      };
      
      await setDoc(userRef, updateData, { merge: true });
      setUserProfile(updateData);
      
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
