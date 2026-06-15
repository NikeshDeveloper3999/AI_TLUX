import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-chatbot-embading-system.firebaseapp.com",
  projectId: "ai-chatbot-embading-system",
  storageBucket: "ai-chatbot-embading-system.firebasestorage.app",
  messagingSenderId: "684285531626",
  appId: "1:684285531626:web:32dad043498a98451ece93"
};

console.log( 'firebase ' + import.meta.env.VITE_FIREBASE_API_KEY)
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}