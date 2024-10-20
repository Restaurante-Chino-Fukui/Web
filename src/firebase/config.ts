import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    // ... otras configuraciones ...
    storageBucket: "tu-proyecto.appspot.com",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
