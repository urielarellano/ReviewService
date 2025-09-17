import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkQmA8bdwOGcR4Y_552sgJ8fKebv3zCd8",
  authDomain: "reviewservice-uri.firebaseapp.com",
  projectId: "reviewservice-uri",
  storageBucket: "reviewservice-uri.firebasestorage.app",
  messagingSenderId: "593778065867",
  appId: "1:593778065867:web:6ddb374aaf58d5ef23b64e",
  measurementId: "G-3CCR4HX2PY"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };