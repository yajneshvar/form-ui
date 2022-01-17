import firebase from "firebase/app";
import "firebase/auth";
import { clearCachedCredential } from "../providers/UserProvider";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGcH3CbH625ZP7TpRjuxBSErT5WMuulRM",
  authDomain: "forms-304923.firebaseapp.com",
  projectId: "forms-304923",
  storageBucket: "forms-304923.appspot.com",
  messagingSenderId: "477953884069",
  appId: "1:477953884069:web:ac38d6a33b550d9788724c",
  measurementId: "G-X6545L4579",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const provider = new firebase.auth.GoogleAuthProvider();

export function googleSignIn() {
  return auth.signInWithRedirect(provider);
}

export function getCredentials() {
  return firebase.auth().getRedirectResult();
}

export function getCurrentUser() {
  return firebase.auth().currentUser;
}

export async function getIdToken() {
  const idToken = await firebase.auth().currentUser?.getIdToken();
  return idToken;
}

export function googleLogout() {
  clearCachedCredential();
  return firebase.auth().signOut();
}
