import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

export const firebaseConfig = {
  apiKey: "AIzaSyC9QNpO0kTr5PcO3BNUYXkvVGW606VVZiw",
  authDomain: "inv-kobicha.firebaseapp.com",
  projectId: "inv-kobicha",
  storageBucket: "inv-kobicha.firebasestorage.app",
  messagingSenderId: "328874096785",
  appId: "1:328874096785:web:c002194e5d123e54d6a730",
  measurementId: "G-BBVTVY6CHJ"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase App Check with reCAPTCHA Enterprise
if (typeof window !== 'undefined') {
  try {
    if ((import.meta as any).env?.DEV) {
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6Lcu-qktAAAAAPPDEqVG2rilEBq0TD0wrnfQyM-e'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn('App Check initialization skipped or already active:', err);
  }
}
