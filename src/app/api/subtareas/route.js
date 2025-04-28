import { db } from '../../../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request) {
  const { nombre, tareaId, fechaEntrega } = await request.json();

  const docRef = await addDoc(collection(db, 'subtareas'), {
    nombre,
    tareaId,
    fechaEntrega: new Date(fechaEntrega),
    estado: 'Pendiente'
  });

  return Response.json({ id: docRef.id });
}
