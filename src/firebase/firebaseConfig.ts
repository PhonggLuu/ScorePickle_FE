// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAd4Djt-SnF9yyu7qvalWunQurZt_eYfQs',
  authDomain: 'scorepickle.firebaseapp.com',
  projectId: 'scorepickle',
  storageBucket: 'scorepickle.firebasestorage.app',
  messagingSenderId: '915476865503',
  appId: '1:915476865503:web:9401e8b32d3c191f4e246a',
  measurementId: 'G-VDNNQHGV61',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
const database = getDatabase(app);

export { analytics, messaging, database };
