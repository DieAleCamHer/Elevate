import { db } from '../../../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request) {
  const { nombre, proyectoId, miembroAsignadoId } = await request.json();

  const docRef = await addDoc(collection(db, 'tareas'), {
    nombre,
    proyectoId,
    miembroAsignadoId,
    estado: 'Pendiente'
  });

  return Response.json({ id: docRef.id });
}
