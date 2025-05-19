import '@/lib/firebase-admin-config';
import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';
import { adminInit } from '@/utils/firebaseAdmin';

adminInit();

async function verificarToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { proyectoId, subtareaId, cambioEstado } = await request.json();

  await addDoc(collection(db, 'historial'), {
    proyectoId,
    subtareaId,
    cambioEstado,
    fechaCambio: new Date()
  });

  return Response.json({ message: 'Cambio registrado en historial' });
}
