// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyAQLlUzpdH_j0Ouy0OFaDV-pRFRdootC2Q',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'anime-website-8c919.firebaseapp.com',
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? 'https://anime-website-8c919-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'anime-website-8c919',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'anime-website-8c919.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER ?? '765187117478',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:765187117478:web:9f23c7747a32ea8ea0bf67',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-GNRS4BPHHG'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export function to initialize firebase
export const initFirebase = () => {
    return app
}