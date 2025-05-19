import { db } from '@/firebaseConfig';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';
import '@/lib/firebase-admin-config';

// ---------------------- MÉTODO GET ----------------------
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const proyectoId = searchParams.get('proyectoId');

  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('[GET] Token recibido:', token);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });
    await verifyFirebaseAdmin(token);

    if (proyectoId) {
      const proyectoRef = doc(db, 'proyectos', proyectoId);
      const proyectoSnap = await getDoc(proyectoRef);

      if (!proyectoSnap.exists()) {
        return Response.json({ message: 'Proyecto no encontrado' }, { status: 404 });
      }

      const proyectoData = proyectoSnap.data();
      const miembros = proyectoData.miembros || [];

      console.log('[GET] Proyecto específico:', proyectoData);
      return Response.json({ id: proyectoSnap.id, ...proyectoData, miembros });
    }

    if (userId) {
      const q = query(collection(db, 'proyectos'), where('creadorId', '==', userId));
      const querySnapshot = await getDocs(q);
      const proyectos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('[GET] Proyectos del usuario:', proyectos);
      return Response.json(proyectos);
    }

    const querySnapshot = await getDocs(collection(db, 'proyectos'));
    const proyectos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('[GET] Todos los proyectos:', proyectos);
    return Response.json(proyectos);
  } catch (error) {
    console.error('[GET] Error al obtener proyectos:', error);
    return Response.json({ message: 'Error al obtener proyectos', error: error.message }, { status: 500 });
  }
}

// ---------------------- MÉTODO POST ----------------------
export async function POST(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  console.log('[POST] Token recibido:', token);
  if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });
  await verifyFirebaseAdmin(token);

  const { nombre, descripcion, fechaEntrega, creadorId } = await request.json();
  console.log('[POST] Datos recibidos:', { nombre, descripcion, fechaEntrega, creadorId });

  if (!creadorId) {
    return Response.json({ message: 'Falta creadorId' }, { status: 400 });
  }

  try {
    await addDoc(collection(db, 'proyectos'), {
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
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  console.log('[DELETE] Token recibido:', token);
  if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });
  await verifyFirebaseAdmin(token);

  const { proyectoId } = await request.json();
  console.log('[DELETE] Proyecto a eliminar:', proyectoId);

  try {
    await deleteDoc(doc(db, 'proyectos', proyectoId));
    return Response.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('[DELETE] Error al eliminar proyecto:', error);
    return Response.json({ message: 'Error al eliminar proyecto', error: error.message }, { status: 500 });
  }
}

// ---------------------- MÉTODO PATCH ----------------------
export async function PATCH(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  console.log('[PATCH] Token recibido:', token);
  if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });
  await verifyFirebaseAdmin(token);

  const { action, proyectoId, miembroId } = await request.json();
  console.log('[PATCH] Acción:', action, 'Proyecto:', proyectoId, 'Miembro:', miembroId);

  if (!action || !proyectoId || !miembroId) {
    return Response.json({ message: 'Datos incompletos' }, { status: 400 });
  }

  try {
    const proyectoRef = doc(db, 'proyectos', proyectoId);

    if (action === 'asignar') {
      await updateDoc(proyectoRef, {
        miembros: arrayUnion(miembroId),
      });
      return Response.json({ message: 'Miembro asignado correctamente' });
    }

    if (action === 'quitar') {
      await updateDoc(proyectoRef, {
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
