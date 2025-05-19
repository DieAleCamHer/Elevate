import '@/lib/firebase-admin-config';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Si se proporciona un ID, buscar un solo usuario
      const userRef = doc(db, 'usuarios', id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
      }

      const data = userSnap.data();
      return new Response(JSON.stringify({ id: userSnap.id, ...data }), { status: 200 });
    }

    // Si no se proporciona un ID, devolver todos los usuarios
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return new Response(JSON.stringify(usuarios), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al obtener usuarios', error: error.message }), { status: 500 });
  }
}
