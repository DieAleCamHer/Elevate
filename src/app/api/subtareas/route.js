import '@/lib/firebase-admin-config';
import { db } from '@/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  doc,
} from 'firebase/firestore';
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

export async function GET(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { searchParams } = new URL(request.url);
  const tareaId = searchParams.get('tareaId');

  if (!tareaId) {
    return Response.json({ message: 'Falta tareaId' }, { status: 400 });
  }

  const q = query(collection(db, 'subtareas'), where('tareaId', '==', tareaId));
  const snapshot = await getDocs(q);
  const subtareas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return Response.json(subtareas);
}

export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { nombre, tareaId } = await request.json();

  if (!nombre || !tareaId) {
    return Response.json({ message: 'Faltan campos' }, { status: 400 });
  }

  const subtareaRef = await addDoc(collection(db, 'subtareas'), {
    nombre,
    tareaId,
    completada: false,
  });

  return Response.json({ message: 'Subtarea creada', id: subtareaRef.id });
}

export async function DELETE(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { subtareaId } = await request.json();

  if (!subtareaId) {
    return Response.json({ message: 'Falta subtareaId' }, { status: 400 });
  }

  await deleteDoc(doc(db, 'subtareas', subtareaId));

  return Response.json({ message: 'Subtarea eliminada' });
}
