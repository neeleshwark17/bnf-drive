import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage'

const app = firebase.initializeApp({
  apiKey: "AIzaSyCVILWDPocfoqqET9fBVGAZ9qbfFaRB0x4",
  authDomain: "bookstore-ejs.firebaseapp.com",
  projectId: "bookstore-ejs",
  storageBucket: "bookstore-ejs.appspot.com",
  messagingSenderId: "346414070768",
  appId: "1:346414070768:web:c789b6cf3eb71155743b35",
  measurementId: "G-N1QCKQW42N",
});

export const firestore = app.firestore();

export const database = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  }, 
  getCurrentTimeStamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const storage=app.storage()
export const auth = app.auth();
export default app;
