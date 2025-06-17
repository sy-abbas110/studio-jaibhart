
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCc1OPVVgfdcJpEzmeTUCguRnr6yFgVHxg",
  authDomain: "jbim-management.firebaseapp.com",
  projectId: "jbim-management",
  storageBucket: "jbim-management.firebasestorage.app",
  messagingSenderId: "465958695125",
  appId: "1:465958695125:web:5354955432df4c7bf5325c",
  measurementId: "G-J2GCZFCVLZ"
};
// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
