import { db } from '@/lib/firebase-admin-db';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const tareasRef = getFirestore().collection('tareas');

async function verificarToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

// ------------------------- GET -------------------------
export async function GET(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const url = new URL(request.url);
  const proyectoId = url.searchParams.get('proyectoId');
  if (!proyectoId)
    return new Response(JSON.stringify({ message: 'Falta proyectoId' }), { status: 400 });

  try {
    const snapshot = await tareasRef.where('proyectoId', '==', proyectoId).get();
    const tareas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return new Response(JSON.stringify(tareas), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener tareas', error: error.message }), { status: 500 });
  }
}

// ------------------------- POST -------------------------
export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { nombre, descripcion, proyectoId } = await request.json();
    if (!nombre || !descripcion || !proyectoId) {
      return new Response(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });
    }

    const nuevaTarea = {
      nombre,
      descripcion,
      proyectoId,
      miembrosAsignados: [],
      createdAt: new Date().toISOString(),
    };

    const docRef = await tareasRef.add(nuevaTarea);
    return new Response(JSON.stringify({ message: 'Tarea creada correctamente', id: docRef.id }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al crear la tarea', error: error.message }), { status: 500 });
  }
}

// ------------------------- DELETE -------------------------
export async function DELETE(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { tareaId } = await request.json();
    if (!tareaId) {
      return new Response(JSON.stringify({ message: 'Falta tareaId' }), { status: 400 });
    }

    await tareasRef.doc(tareaId).delete();
    return new Response(JSON.stringify({ message: 'Tarea eliminada correctamente' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar tarea', error: error.message }), { status: 500 });
  }
}