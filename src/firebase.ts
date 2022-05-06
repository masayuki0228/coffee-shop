import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAByHYC59HTD8HAZuDWqV9K-w7KTSnvrNY",
  authDomain: "coffee-shop-13638.firebaseapp.com",
  projectId: "coffee-shop-13638",
  storageBucket: "coffee-shop-13638.appspot.com",
  messagingSenderId: "535191629668",
  appId: "1:535191629668:web:739957a16f27a0627a9471",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
