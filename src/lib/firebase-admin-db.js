// lib/firebase-admin-db.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error('Falta GOOGLE_APPLICATION_CREDENTIALS en .env.local');
}

const absolutePath = join(process.cwd(), serviceAccountPath);

let db;

if (!getApps().length) {
  const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
  const app = initializeApp({ credential: cert(serviceAccount) });
  db = getFirestore(app);
} else {
  db = getFirestore();
}

export { db };
