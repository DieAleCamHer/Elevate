// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración específica de tu Firebase Elevate
const firebaseConfig = {
  apiKey: "AIzaSyAekfXKEkHZUl2y1Y1S3hHPCDrIQmZAN78",
  authDomain: "elevate-2b09f.firebaseapp.com",
  projectId: "elevate-2b09f",
  storageBucket: "elevate-2b09f.appspot.com",
  messagingSenderId: "219025653445",
  appId: "1:219025653445:web:6d046a3f13dc34c96e7aac"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios para usar en toda tu plataforma
export const auth = getAuth(app);
export const db = getFirestore(app);
