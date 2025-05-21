import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';
import { FieldValue } from 'firebase-admin/firestore';

const arrayUnion = FieldValue.arrayUnion;
const arrayRemove = FieldValue.arrayRemove;

const getToken = (request) => request.headers.get('authorization')?.replace('Bearer ', '');

export async function PUT(request, { params }) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { id } = params;
    const { miembroId } = await request.json();

    if (!id || !miembroId) {
      return Response.json({ message: 'Faltan datos' }, { status: 400 });
    }

    const tareaRef = db.collection('tareas').doc(id);
    await tareaRef.update({
      miembrosAsignados: arrayUnion(miembroId),
    });

    return Response.json({ message: 'Miembro asignado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('[PUT] Error al asignar miembro:', error);
    return Response.json({ message: 'Error al asignar miembro', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { id } = params;
    const { miembroId } = await request.json();

    if (!id || !miembroId) {
      return Response.json({ message: 'Faltan datos' }, { status: 400 });
    }

    const tareaRef = db.collection('tareas').doc(id);
    await tareaRef.update({
      miembrosAsignados: arrayRemove(miembroId),
    });

    return Response.json({ message: 'Miembro eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE] Error al eliminar miembro:', error);
    return Response.json({ message: 'Error al eliminar miembro', error: error.message }, { status: 500 });
  }
}
