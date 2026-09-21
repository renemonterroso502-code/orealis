// firebase/config.js

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import { getAuth } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// ⚠️ IMPORTANTE: reemplaza estos valores con los de TU propio
// proyecto de Firebase. Los sacas en:
// Firebase Console > (tu proyecto) > ⚙️ Configuración del proyecto
// > "Tus apps" > app web > "SDK setup and configuration".
// Mira GUIA_FIREBASE.md para el paso a paso completo.

const firebaseConfig = {
  apiKey: "AIzaSyAHAK9I7_3nvuO37furEEeoyrEObXMRmqE",
  authDomain: "orealis-9450d.firebaseapp.com",
  projectId: "orealis-9450d",
  storageBucket: "orealis-9450d.firebasestorage.app",
  messagingSenderId: "1033988270522",
  appId: "1:1033988270522:web:52c711f9e71a11890c5583"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);

export const auth = getAuth(app);