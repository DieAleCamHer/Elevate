import '@/lib/firebase-admin-config';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase-admin/auth';
import { adminInit } from '@/utils/firebaseAdmin';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';

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

  const url = new URL(request.url);
  const proyectoId = url.searchParams.get('proyectoId');

  if (!proyectoId) {
    return new Response(JSON.stringify({ message: 'Falta proyectoId' }), { status: 400 });
  }

  try {
    const tareasRef = collection(db, 'tareas');
    const q = query(tareasRef, where('proyectoId', '==', proyectoId));
    const querySnapshot = await getDocs(q);

    const tareas = [];
    querySnapshot.forEach((doc) => {
      tareas.push({ id: doc.id, ...doc.data() });
    });

    return new Response(JSON.stringify(tareas), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener tareas', error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { tareaId } = await request.json();

    if (!tareaId) {
      return new Response(JSON.stringify({ message: 'Falta tareaId' }), { status: 400 });
    }

    await deleteDoc(doc(db, 'tareas', tareaId));

    return new Response(JSON.stringify({ message: 'Tarea eliminada correctamente' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar tarea', error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { nombre, descripcion, proyectoId } = await request.json();

    if (!nombre || !descripcion || !proyectoId) {
      return new Response(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const tareaRef = collection(db, 'tareas');
    const docRef = await addDoc(tareaRef, {
      nombre,
      descripcion,
      proyectoId,
      miembrosAsignados: [],
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: 'Tarea creada correctamente', id: docRef.id }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al crear la tarea', error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { tareaId, proyectoId, miembroId } = await request.json();

  if (!tareaId || !proyectoId || !miembroId) {
    return new Response(JSON.stringify({ message: 'Faltan datos' }), { status: 400 });
  }

  try {
    const tareaRef = doc(db, 'tareas', tareaId);
    await updateDoc(tareaRef, {
      miembrosAsignados: arrayUnion(miembroId),
    });

    return new Response(JSON.stringify({ message: 'Miembro asignado correctamente' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al asignar miembro', error: error.message }), { status: 500 });
  }
}
