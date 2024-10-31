import { useState, useEffect } from 'react';
import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDjjQz0tNW45KB8RIxanTTFPzeJntjnEaY",
    authDomain: "restaurante-fukui.firebaseapp.com",
    projectId: "restaurante-fukui",
    storageBucket: "restaurante-fukui.appspot.com",
    messagingSenderId: "310991952782",
    appId: "1:310991952782:web:92ea35cc3fed1749e562df",
    measurementId: "G-P4S174MCVK"
};

interface FirebaseInstance {
    app: FirebaseApp;
    storage: FirebaseStorage;
}

let firebaseInstance: FirebaseInstance | null = null;

export function useFirebase() {
    const [firebase, setFirebase] = useState<FirebaseInstance | null>(null);

    useEffect(() => {
        if (!firebaseInstance) {
            const apps = getApps();
            const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
            const storage = getStorage(app);
            firebaseInstance = { app, storage };
        }
        setFirebase(firebaseInstance);
    }, []);

    return firebase;
}
