import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request) {
  const { proyectoId, subtareaId, cambioEstado } = await request.json();

  await addDoc(collection(db, 'historial'), {
    proyectoId,
    subtareaId,
    cambioEstado,
    fechaCambio: new Date()
  });

  return Response.json({ message: 'Cambio registrado en historial' });
}
