import firebase from 'firebase';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGcH3CbH625ZP7TpRjuxBSErT5WMuulRM",
    authDomain: "forms-304923.firebaseapp.com",
    projectId: "forms-304923",
    storageBucket: "forms-304923.appspot.com",
    messagingSenderId: "477953884069",
    appId: "1:477953884069:web:ac38d6a33b550d9788724c",
    measurementId: "G-X6545L4579"
  };


firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export function GoogleSignIn() {
    return auth.signInWithRedirect(provider)
}

export function GetCredentials() {
    return firebase.auth()
    .getRedirectResult();
}

export function GoogleLogout() {
    return firebase.auth().signOut()
}

