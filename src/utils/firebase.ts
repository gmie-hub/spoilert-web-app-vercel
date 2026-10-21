import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

import { firebaseConfig, isFirebaseConfigured } from "./firebaseConfig";

const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables in .env.",
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const getChatDb = (): Firestore => getFirestore(getFirebaseApp());

export const getChatStorage = (): FirebaseStorage => getStorage(getFirebaseApp());
