/* FIREBASE */
firebase.initializeApp({
    apiKey: "AIzaSyBRpfqXx2-wqScskfC7GCnJ1CkVFV5nbxw",
    authDomain: "memorias-sgm.firebaseapp.com",
    projectId: "memorias-sgm",
    storageBucket: "memorias-sgm.appspot.com",
    messagingSenderId: "364371306969",
    appId: "1:364371306969:web:ac5d78ae8f6624f22c91c8",
    measurementId: "G-KPCXCFM981"
});
const db = firebase.firestore();
const storage = firebase.storage();