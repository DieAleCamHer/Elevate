import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';

const tareasRef = db.collection('tareas');

const getToken = (request) => request.headers.get('authorization')?.replace('Bearer ', '');

// ------------------------- GET -------------------------
export async function GET(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const url = new URL(request.url);
    const proyectoId = url.searchParams.get('proyectoId');
    if (!proyectoId) return Response.json({ message: 'Falta proyectoId' }, { status: 400 });

    const snapshot = await tareasRef.where('proyectoId', '==', proyectoId).get();
    const tareas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return Response.json(tareas);
  } catch (error) {
    return Response.json({ message: 'Error al obtener tareas', error: error.message }, { status: 500 });
  }
}

// ------------------------- POST -------------------------
export async function POST(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { nombre, descripcion, proyectoId } = await request.json();
    if (!nombre || !descripcion || !proyectoId) {
      return Response.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const nuevaTarea = {
      nombre,
      descripcion,
      proyectoId,
      miembrosAsignados: [],
      createdAt: new Date().toISOString(),
    };

    const docRef = await tareasRef.add(nuevaTarea);
    return Response.json({ message: 'Tarea creada correctamente', id: docRef.id }, { status: 201 });
  } catch (error) {
    return Response.json({ message: 'Error al crear la tarea', error: error.message }, { status: 500 });
  }
}

// ------------------------- DELETE -------------------------
export async function DELETE(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { tareaId } = await request.json();
    if (!tareaId) {
      return Response.json({ message: 'Falta tareaId' }, { status: 400 });
    }

    await tareasRef.doc(tareaId).delete();
    return Response.json({ message: 'Tarea eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Error al eliminar tarea', error: error.message }, { status: 500 });
  }
}
