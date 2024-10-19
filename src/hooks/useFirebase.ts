import { useState, useEffect } from 'react';
import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    // Tu configuración de Firebase
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
