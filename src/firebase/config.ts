import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBl6zt73_HzSw4ng6dJDitXvudH16bQBZM",
  authDomain: "portfoliozz-website.firebaseapp.com",
  projectId: "portfoliozz-website",
  storageBucket: "portfoliozz-website.firebasestorage.app",
  messagingSenderId: "972355157609",
  appId: "1:972355157609:web:f7fae50c43cb01b7726cf8",
  measurementId: "G-LJ5N63BND4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Only initialize analytics if window is available (client-side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;