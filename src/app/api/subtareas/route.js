import { db } from '@/lib/firebase-admin-db';
import { getAuth } from 'firebase-admin/auth';

// ------------------ FUNCIONES AUXILIARES ------------------
async function verificarToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

// ------------------ GET: Obtener subtareas por tareaId ------------------
export async function GET(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  const { searchParams } = new URL(request.url);
  const tareaId = searchParams.get('tareaId');
  if (!tareaId)
    return new Response(JSON.stringify({ message: 'Falta tareaId' }), { status: 400 });

  try {
    const snapshot = await db
      .collection('subtareas') // ✅ sin usar collection() importado
      .where('tareaId', '==', tareaId)
      .get();

    const subtareas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(subtareas), { status: 200 });
  } catch (error) {
    console.error('[GET] Error al obtener subtareas:', error);
    return new Response(JSON.stringify({ message: 'Error al obtener subtareas' }), { status: 500 });
  }
}

// ------------------ POST: Crear una nueva subtarea ------------------
export async function POST(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { nombre, tareaId } = await request.json();
    if (!nombre || !tareaId)
      return new Response(JSON.stringify({ message: 'Faltan campos requeridos' }), { status: 400 });

    const nuevaRef = await db.collection('subtareas').add({
      nombre,
      tareaId,
      createdAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ message: 'Subtarea creada', id: nuevaRef.id }), { status: 201 });
  } catch (error) {
    console.error('[POST] Error al crear subtarea:', error);
    return new Response(JSON.stringify({ message: 'Error al crear subtarea' }), { status: 500 });
  }
}

// ------------------ DELETE: Eliminar subtarea ------------------
export async function DELETE(request) {
  const userId = await verificarToken(request);
  if (!userId)
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });

  try {
    const { subtareaId } = await request.json();
    if (!subtareaId)
      return new Response(JSON.stringify({ message: 'Falta subtareaId' }), { status: 400 });

    await db.collection('subtareas').doc(subtareaId).delete();
    return new Response(JSON.stringify({ message: 'Subtarea eliminada' }), { status: 200 });
  } catch (error) {
    console.error('[DELETE] Error al eliminar subtarea:', error);
    return new Response(JSON.stringify({ message: 'Error al eliminar subtarea' }), { status: 500 });
  }
}
