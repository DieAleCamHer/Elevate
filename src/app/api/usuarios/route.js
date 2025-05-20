import { db } from '@/lib/firebase-admin-db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const userRef = db.collection('usuarios').doc(id);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
      }

      return new Response(JSON.stringify({ id: userSnap.id, ...userSnap.data() }), { status: 200 });
    }

    const querySnapshot = await db.collection('usuarios').get();
    const usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return new Response(JSON.stringify(usuarios), { status: 200 });
  } catch (error) {
    console.error('[GET] Error al obtener usuarios:', error);
    return new Response(JSON.stringify({ message: 'Error al obtener usuarios', error: error.message }), { status: 500 });
  }
}
