import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    // Tu configuración de Firebase
};

let app, storage;

if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
}

export { app, storage };
