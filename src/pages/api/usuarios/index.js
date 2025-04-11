import { pool } from '@/config/db';
import { agregarUsuario, actualizarUsuario, eliminarUsuario } from '@/lib/usuarios';

export default async function handler(req, res) {
   
    const reqUser = { id: 1, rol_id: 1 }; 

    if (reqUser.rol_id !== 1) {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden gestionar usuarios.' });
    }

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT id, nombre_usuario, rol_id FROM usuarios');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { nombre_usuario, contrasena, rol_id } = req.body;

            if (!nombre_usuario || !contrasena) {
                return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
            }

            const result = await agregarUsuario({ nombre_usuario, contrasena, rol_id }, reqUser.id);
            return res.status(201).json(result);

        } catch (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ error: 'Error al crear usuario.' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, nombre_usuario, contrasena, rol_id } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID del usuario es obligatorio para actualizar.' });
            }

            const result = await actualizarUsuario(id, { nombre_usuario, contrasena, rol_id }, reqUser.id);
            return res.status(200).json(result);

        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({ error: 'Error al actualizar usuario.' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID del usuario es obligatorio para eliminar.' });
            }

            const result = await eliminarUsuario(id, reqUser.id);
            return res.status(200).json(result);

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({ error: 'Error al eliminar usuario.' });
        }
    }

    return res.status(405).json({ error: 'Método no permitido.' });
}