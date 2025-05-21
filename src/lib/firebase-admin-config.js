// lib/firebase-admin-config.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error('Falta GOOGLE_APPLICATION_CREDENTIALS en .env.local');
}

const absolutePath = join(process.cwd(), serviceAccountPath);

// Solo inicializar la app una vez
if (!getApps().length) {
  const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Exportar instancia directa (opcionalmente útil en algunos casos)
export const adminAuth = getAuth();

// Función para verificar token con Firebase Admin
export async function verifyFirebaseAdmin(token) {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error('Error al verificar token Firebase Admin:', error);
    throw new Error('Token inválido o expirado');
  }
}
