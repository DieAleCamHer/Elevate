import { getUsuarioPorId, actualizarUsuario, eliminarUsuario } from '@/lib/usuarios';

export default async function handler(req, res) {
    // Simulación temporal de usuario autenticado (solo para desarrollo sin middleware)
    const reqUser = { id: 1, rol_id: 1 };

    // Solo administrador puede acceder
    if (reqUser.rol_id !== 1) {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden gestionar usuarios.' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'Falta el ID del usuario' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const usuario = await getUsuarioPorId(id);
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                res.status(200).json(usuario);
            } catch (error) {
                console.error('Error al obtener usuario:', error);
                res.status(500).json({ message: 'Error al obtener el usuario' });
            }
            break;

        case 'PUT':
            try {
                const { nombre_usuario, contrasena, rol_id } = req.body;

                const usuarioActualizado = await actualizarUsuario(id, {
                    nombre_usuario,
                    contrasena, // ya no encriptado
                    rol_id
                }, reqUser.id);

                res.status(200).json(usuarioActualizado);
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                res.status(500).json({ message: 'Error al actualizar el usuario' });
            }
            break;

        case 'DELETE':
            try {
                const result = await eliminarUsuario(id, reqUser.id);
                res.status(200).json(result);
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                res.status(500).json({ message: 'Error al eliminar el usuario' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} no permitido`);
            break;
    }
}
        