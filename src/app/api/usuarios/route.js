import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';

const getToken = (request) => request.headers.get('authorization')?.replace('Bearer ', '');

export async function GET(request) {
  try {
    const token = getToken(request);
    if (!token) return Response.json({ message: 'Token no proporcionado' }, { status: 401 });

    await verifyFirebaseAdmin(token);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const userRef = db.collection('usuarios').doc(id);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return Response.json({ message: 'Usuario no encontrado' }, { status: 404 });
      }

      return Response.json({ id: userSnap.id, ...userSnap.data() }, { status: 200 });
    }

    const querySnapshot = await db.collection('usuarios').get();
    const usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(usuarios, { status: 200 });
  } catch (error) {
    console.error('[GET] Error al obtener usuarios:', error);
    return Response.json({ message: 'Error al obtener usuarios', error: error.message }, { status: 500 });
  }
}
