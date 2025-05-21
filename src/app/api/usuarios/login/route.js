import { db } from '@/lib/firebase-admin-db';
import { verifyFirebaseAdmin } from '@/lib/firebase-admin-config';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = await verifyFirebaseAdmin(token);
    const uid = decoded.uid;

    // Acceder directamente al documento con ID = uid
    const userDoc = await db.collection('usuarios').doc(uid).get();

    if (!userDoc.exists) {
      return Response.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const userData = userDoc.data();

    return Response.json({
      uid,
      username: userData.username,
      nombre: userData.nombre,
      rol: userData.rol,
    });
  } catch (error) {
    console.error('[GET /api/usuarios/login] Error:', error);
    return Response.json({ message: 'Error interno', error: error.message }, { status: 500 });
  }
}
