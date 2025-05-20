import { db } from '@/lib/firebase-admin-db';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

const arrayUnion = FieldValue.arrayUnion;
const arrayRemove = FieldValue.arrayRemove;

async function verificarToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch (e) {
    console.error('Error al verificar token:', e);
    return null;
  }
}

export async function PUT(request, { params }) {
  const userId = await verificarToken(request);
  if (!userId) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const { id } = params;
  const { miembroId } = await request.json();

  if (!id || !miembroId) {
    return new Response(JSON.stringify({ message: 'Faltan datos' }), { status: 400 });
  }

  try {
    const tareaRef = db.collection('tareas').doc(id);
    await tareaRef.update({
      miembrosAsignados: arrayUnion(miembroId),
    });

    return new Response(JSON.stringify({ message: 'Miembro asignado correctamente' }), { status: 200 });
  } catch (error) {
    console.error('[PUT] Error al asignar miembro:', error);
    return new Response(JSON.stringify({ message: 'Error al asignar miembro', error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const userId = await verificarToken(request);
  if (!userId) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  const { id } = params;
  const { miembroId } = await request.json();

  if (!id || !miembroId) {
    return new Response(JSON.stringify({ message: 'Faltan datos' }), { status: 400 });
  }

  try {
    const tareaRef = db.collection('tareas').doc(id);
    await tareaRef.update({
      miembrosAsignados: arrayRemove(miembroId),
    });

    return new Response(JSON.stringify({ message: 'Miembro eliminado correctamente' }), { status: 200 });
  } catch (error) {
    console.error('[DELETE] Error al eliminar miembro:', error);
    return new Response(JSON.stringify({ message: 'Error al eliminar miembro', error: error.message }), { status: 500 });
  }
}
