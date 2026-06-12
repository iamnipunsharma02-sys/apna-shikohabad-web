import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { 
  initializeFirestore,
  doc, 
  getDocFromServer,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services with Force Long Polling to avoid WebSocket failures in proxies
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/drive");

// Export authentication primitives
export { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

// Custom Validation Connections test
export async function testConnection() {
  try {
    // Attempt connection check, catch rejection to avoid unhandled promise warnings
    await getDocFromServer(doc(db, "test", "connection")).catch((err) => {
      console.warn("Firestore server check resolved to offline/cached mode.", err.message || err);
    });
    console.log("Firebase Firestore Connection test executed.");
  } catch (error) {
    console.warn("Firestore client warning:", error);
  }
}

// Section 3: Error Handlers in accordance with the critical Firebase skill mandate
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error payload: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Standard helper functions wrapped with robust error logging
export async function safeGetDocs(collectionPath: string, queryConstraint?: any) {
  try {
    const ref = collection(db, collectionPath);
    const q = queryConstraint ? query(ref, queryConstraint) : ref;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collectionPath);
    return [];
  }
}

export async function safeSetDoc(collectionPath: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${docId}`);
  }
}

export async function safeUpdateDoc(collectionPath: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${collectionPath}/${docId}`);
  }
}

export async function safeDeleteDoc(collectionPath: string, docId: string) {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${docId}`);
  }
}

// Auto Test Connection on module load
testConnection();
