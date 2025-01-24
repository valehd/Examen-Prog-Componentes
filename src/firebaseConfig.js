import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Importar Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyDtwCuIXByJl_OlncFTgodJq3hxslm5hGg",
    authDomain: "lista-productos-vhernandez.firebaseapp.com",
    projectId: "lista-productos-vhernandez",
    storageBucket: "lista-productos-vhernandez.appspot.com", // Storage Bucket
    messagingSenderId: "94234323935",
    appId: "1:94234323935:web:ea629cb00570c9aa16f26a",
    measurementId: "G-4CR1WS6RWH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);  // Configurar Storage

export { db, auth, storage };  // Exportar también storage
