// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace these values with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
  measurementId: "G-DEMO"
};

let app = null;
let db = null;

try {
  // Initialize Firebase only if config is valid
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized with demo config - features will be limited");
} catch (error) {
  console.warn("Firebase initialization failed:", error.message);
  console.log("Running in offline mode - Firebase features disabled");
}

// Export safe db instance
export { db };
export default app; 