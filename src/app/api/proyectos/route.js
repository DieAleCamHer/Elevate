import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const proyectoId = searchParams.get('proyectoId');

  try {
    if (proyectoId) {
      // Si piden un proyecto específico
      const proyectoRef = doc(db, 'proyectos', proyectoId);
      const proyectoSnap = await getDoc(proyectoRef);

      if (!proyectoSnap.exists()) {
        return Response.json({ message: 'Proyecto no encontrado' }, { status: 404 });
      }

      return Response.json({ id: proyectoSnap.id, ...proyectoSnap.data() });
    }

    if (userId) {
      // Si piden todos los proyectos de un usuario
      const q = query(collection(db, 'proyectos'), where('creadorId', '==', userId));
      const querySnapshot = await getDocs(q);
      const proyectos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return Response.json(proyectos);
    }

    // Si no pasan ningún parámetro, traer todos los proyectos
    const querySnapshot = await getDocs(collection(db, 'proyectos'));
    const proyectos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(proyectos);

  } catch (error) {
    return Response.json({ message: 'Error al obtener proyectos', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { nombre, descripcion, fechaEntrega, creadorId } = await request.json();

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
      miembros: []
    });

    return Response.json({ message: 'Proyecto creado correctamente' });
  } catch (error) {
    return Response.json({ message: 'Error al crear proyecto', error: error.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  const { proyectoId } = await request.json();

  try {
    await deleteDoc(doc(db, 'proyectos', proyectoId));
    return Response.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    return Response.json({ message: 'Error al eliminar proyecto', error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { action, proyectoId, miembroId } = await request.json();

  if (!action || !proyectoId || !miembroId) {
    return Response.json({ message: 'Datos incompletos' }, { status: 400 });
  }

  try {
    const proyectoRef = doc(db, 'proyectos', proyectoId);

    if (action === 'asignar') {
      await updateDoc(proyectoRef, {
        miembros: arrayUnion(miembroId)
      });
      return Response.json({ message: 'Miembro asignado correctamente' });
    }

    if (action === 'quitar') {
      await updateDoc(proyectoRef, {
        miembros: arrayRemove(miembroId)
      });
      return Response.json({ message: 'Miembro quitado correctamente' });
    }

    return Response.json({ message: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    return Response.json({ message: 'Error al actualizar proyecto', error: error.message }, { status: 500 });
  }
}
