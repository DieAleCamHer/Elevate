import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error('Falta GOOGLE_APPLICATION_CREDENTIALS en .env.local');
}

const absolutePath = join(process.cwd(), serviceAccountPath);

if (!getApps().length) {
  const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

// EXPORTAR LA FUNCIÓN PARA VERIFICAR TOKEN
export async function verifyFirebaseAdmin(token) {
  const auth = getAuth();
  return await auth.verifyIdToken(token);
}
