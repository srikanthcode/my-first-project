import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAx6let2JHUb_OWuvi8GOg7O6xwfO0Fj1E",
    authDomain: "o-auth-b5909.firebaseapp.com",
    databaseURL: "https://o-auth-b5909-default-rtdb.firebaseio.com",
    projectId: "o-auth-b5909",
    storageBucket: "o-auth-b5909.firebasestorage.app",
    messagingSenderId: "65529475377",
    appId: "1:65529475377:web:4d7b4bc22c675df8d64010",
    measurementId: "G-KSSJLWJQJJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, googleProvider, analytics };
