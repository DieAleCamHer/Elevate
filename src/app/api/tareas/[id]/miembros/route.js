import '@/lib/firebase-admin-config';
import { db } from '@/firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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

export async function PUT(request, { params }) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { id } = params;
  const { miembroId } = await request.json();

  if (!id || !miembroId) {
    return new Response(JSON.stringify({ message: 'Faltan datos' }), { status: 400 });
  }

  try {
    const tareaRef = doc(db, 'tareas', id);
    await updateDoc(tareaRef, {
      miembrosAsignados: arrayUnion(miembroId),
    });

    return new Response(JSON.stringify({ message: 'Miembro asignado correctamente' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al asignar miembro', error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const userId = await verificarToken(request);
  if (!userId) return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { id } = params;
  let body;

  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Cuerpo inválido' }), { status: 400 });
  }

  const { miembroId } = body;

  if (!id || !miembroId) {
    return new Response(JSON.stringify({ message: 'Faltan datos' }), { status: 400 });
  }

  try {
    const tareaRef = doc(db, 'tareas', id);
    await updateDoc(tareaRef, {
      miembrosAsignados: arrayRemove(miembroId),
    });

    return new Response(JSON.stringify({ message: 'Miembro eliminado correctamente' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar miembro', error: error.message }), { status: 500 });
  }
}
