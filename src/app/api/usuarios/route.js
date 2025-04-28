import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(usuarios);
  } catch (error) {
    return Response.json({ message: 'Error al obtener usuarios', error: error.message }, { status: 500 });
  }
}
