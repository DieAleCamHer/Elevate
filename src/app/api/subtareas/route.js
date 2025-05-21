import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';

const getToken = (request) => request.headers.get('authorization')?.replace('Bearer ', '');

// ------------------ GET: Obtener subtareas por tareaId ------------------
export async function GET(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { searchParams } = new URL(request.url);
    const tareaId = searchParams.get('tareaId');
    if (!tareaId) return Response.json({ message: 'Falta tareaId' }, { status: 400 });

    const snapshot = await db
      .collection('subtareas')
      .where('tareaId', '==', tareaId)
      .get();

    const subtareas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(subtareas);
  } catch (error) {
    console.error('[GET] Error al obtener subtareas:', error);
    return Response.json({ message: 'Error al obtener subtareas', error: error.message }, { status: 500 });
  }
}

// ------------------ POST: Crear una nueva subtarea ------------------
export async function POST(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { nombre, tareaId } = await request.json();
    if (!nombre || !tareaId)
      return Response.json({ message: 'Faltan campos requeridos' }, { status: 400 });

    const nuevaRef = await db.collection('subtareas').add({
      nombre,
      tareaId,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ message: 'Subtarea creada', id: nuevaRef.id }, { status: 201 });
  } catch (error) {
    console.error('[POST] Error al crear subtarea:', error);
    return Response.json({ message: 'Error al crear subtarea', error: error.message }, { status: 500 });
  }
}

// ------------------ DELETE: Eliminar subtarea ------------------
export async function DELETE(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { subtareaId } = await request.json();
    if (!subtareaId)
      return Response.json({ message: 'Falta subtareaId' }, { status: 400 });

    await db.collection('subtareas').doc(subtareaId).delete();
    return Response.json({ message: 'Subtarea eliminada' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE] Error al eliminar subtarea:', error);
    return Response.json({ message: 'Error al eliminar subtarea', error: error.message }, { status: 500 });
  }
}
