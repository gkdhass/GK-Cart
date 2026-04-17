/**
 * @file client/src/utils/firebaseConfig.js
 * @description Firebase configuration for Google + GitHub OAuth login.
 * Validates env vars, initializes Firebase, and exports sign-in functions.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ── Read config from Vite env variables ──────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ── Validate all required keys ───────────────────────────────────────
const REQUIRED_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

let firebaseReady = false;

const missingKeys = Object.entries(REQUIRED_KEYS)
  .filter(([key]) => !firebaseConfig[key] || firebaseConfig[key] === 'undefined')
  .map(([, envName]) => envName);

if (missingKeys.length > 0) {
  console.error('❌ Missing Firebase env vars:', missingKeys.join(', '));
  console.error('⚠️  Add them to client/.env and restart the dev server!');
} else {
  firebaseReady = true;
  console.log('✅ Firebase config loaded!');
}

// ── Initialize Firebase ──────────────────────────────────────────────
let app = null;
let auth = null;
let storage = null;
let googleProvider = null;
let githubProvider = null;

if (firebaseReady) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);

    // Google provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    // GitHub provider
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope('user:email');
  } catch (error) {
    console.error('❌ Firebase init failed:', error.message);
    firebaseReady = false;
  }
}

// ── Error message helper ─────────────────────────────────────────────
function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not enabled. Go to Firebase Console → Authentication → Get Started, then enable Google/GitHub sign-in methods.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup can be open at a time.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in method. Try using Google login instead.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase Auth. Add it to Firebase Console → Authentication → Settings → Authorized domains.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

// ── Google Sign In ───────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  if (!firebaseReady || !auth || !googleProvider) {
    throw new Error(
      'Firebase is not configured. Please check your .env file and restart the dev server.'
    );
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return {
      name: user.displayName || 'Google User',
      email: user.email,
      photo: user.photoURL || '',
      googleId: user.uid,
      token: await user.getIdToken(),
    };
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// ── GitHub Sign In ───────────────────────────────────────────────────
export const signInWithGithub = async () => {
  if (!firebaseReady || !auth || !githubProvider) {
    throw new Error(
      'Firebase is not configured. Please check your .env file and restart the dev server.'
    );
  }

  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    return {
      name: user.displayName || 'GitHub User',
      email: user.email,
      photo: user.photoURL || '',
      githubId: user.uid,
      token: await user.getIdToken(),
    };
  } catch (error) {
    console.error('GitHub sign-in error:', error.code, error.message);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export { auth, googleProvider, githubProvider, firebaseReady, storage };
export default app;
