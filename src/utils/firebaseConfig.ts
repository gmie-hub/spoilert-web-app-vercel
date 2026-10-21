// Chat runs on the same Firebase project as the mobile app (Firestore for
// conversations, messages and presence; Storage for media), so web and mobile
// users talk in the same threads. These are the project's web-app keys;
// Firebase web config is public by design and is not a secret.
//
// Kept apart from ./firebase so code that only needs to know whether chat is
// configured doesn't pull the Firebase SDK into its bundle.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);
