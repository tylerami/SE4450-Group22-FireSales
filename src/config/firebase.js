import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebase.config";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const analytics = getAnalytics(firebase);
export const auth = getAuth();
export const storage = getStorage(firebase);
export const Providers = { google: new GoogleAuthProvider() };

export const signInWithEmailPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
