import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';
import { FieldValue } from 'firebase-admin/firestore';

const arrayUnion = FieldValue.arrayUnion;
const arrayRemove = FieldValue.arrayRemove;

// ---------------------- MÉTODO GET ----------------------
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    const decoded = await verifyFirebaseAdmin(token);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const proyectoId = searchParams.get('proyectoId');

    if (proyectoId) {
      const snap = await db.collection('proyectos').doc(proyectoId).get();
      if (!snap.exists) {
        return Response.json({ message: 'Proyecto no encontrado' }, { status: 404 });
      }
      return Response.json({ id: snap.id, ...snap.data() });
    }

    if (userId) {
      const q = db.collection('proyectos').where('creadorId', '==', userId);
      const querySnapshot = await q.get();
      const proyectos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return Response.json(proyectos);
    }

    const snap = await db.collection('proyectos').get();
    const proyectos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(proyectos);
  } catch (error) {
    console.error('[GET] Error al obtener proyectos:', error);
    return Response.json({ message: 'Error al obtener proyectos', error: error.message }, { status: 500 });
  }
}

// ---------------------- MÉTODO POST ----------------------
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { nombre, descripcion, fechaEntrega, creadorId } = await request.json();
    if (!creadorId) {
      return Response.json({ message: 'Falta creadorId' }, { status: 400 });
    }

    await db.collection('proyectos').add({
      nombre,
      descripcion,
      fechaEntrega,
      fechaCreacion: new Date().toISOString(),
      creadorId,
      miembros: [],
    });

    return Response.json({ message: 'Proyecto creado correctamente' });
  } catch (error) {
    console.error('[POST] Error al crear proyecto:', error);
    return Response.json({ message: 'Error al crear proyecto', error: error.message }, { status: 500 });
  }
}

// ---------------------- MÉTODO DELETE ----------------------
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { proyectoId } = await request.json();
    if (!proyectoId) {
      return Response.json({ message: 'Falta proyectoId' }, { status: 400 });
    }

    await db.collection('proyectos').doc(proyectoId).delete();
    return Response.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('[DELETE] Error al eliminar proyecto:', error);
    return Response.json({ message: 'Error al eliminar proyecto', error: error.message }, { status: 500 });
  }
}

// ---------------------- MÉTODO PATCH ----------------------
export async function PATCH(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { action, proyectoId, miembroId } = await request.json();

    if (!action || !proyectoId || !miembroId) {
      return Response.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    const proyectoRef = db.collection('proyectos').doc(proyectoId);

    if (action === 'asignar') {
      await proyectoRef.update({
        miembros: arrayUnion(miembroId),
      });
      return Response.json({ message: 'Miembro asignado correctamente' });
    }

    if (action === 'quitar') {
      await proyectoRef.update({
        miembros: arrayRemove(miembroId),
      });
      return Response.json({ message: 'Miembro quitado correctamente' });
    }

    return Response.json({ message: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('[PATCH] Error al actualizar proyecto:', error);
    return Response.json({ message: 'Error al actualizar proyecto', error: error.message }, { status: 500 });
  }
}
