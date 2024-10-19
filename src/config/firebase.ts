import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    // Aquí van tus credenciales de Firebase
    apiKey: "AIzaSyDjjQz0tNW45KB8RIxanTTFPzeJntjnEaY",
    authDomain: "restaurante-fukui.firebaseapp.com",
    projectId: "restaurante-fukui",
    storageBucket: "restaurante-fukui.appspot.com",
    messagingSenderId: "310991952782",
    appId: "1:310991952782:web:92ea35cc3fed1749e562df",
    measurementId: "G-P4S174MCVK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Analytics (opcional)
export const analytics = getAnalytics(app);
