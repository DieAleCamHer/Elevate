import { db } from '@/lib/firebase-admin-db';
import { getAuth } from 'firebase-admin/auth';
import { collection, addDoc } from 'firebase-admin/firestore';

async function verificarToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}

export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId) return Response.json({ message: 'No autorizado' }, { status: 401 });

  const { proyectoId, subtareaId, cambioEstado } = await request.json();
  await addDoc(collection(db, 'historial'), {
    proyectoId,
    subtareaId,
    cambioEstado,
    fechaCambio: new Date(),
  });
  return Response.json({ message: 'Cambio registrado en historial' });
}
