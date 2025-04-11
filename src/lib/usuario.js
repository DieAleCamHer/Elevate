import { pool } from '../config/db';

// Obtener un usuario por ID
export async function getUsuarioPorId(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : { message: 'Usuario no encontrado' };
    } catch (error) {
        return { message: 'Error al obtener el usuario' };
    }
}

// Obtener el nombre legible del rol
export function obtenerNombreRol(rolId) {
    const roles = {
        1: 'Administrador del Sistema',
        2: 'Gerente del Proyecto',
        3: 'Miembro del Proyecto'
    };
    return roles[rolId] || 'Rol desconocido';
}

// Obtener el nombre de un usuario por ID
export async function obtenerNombreUsuario(id) {
    try {
        const [rows] = await pool.query('SELECT nombre_usuario FROM usuarios WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0].nombre_usuario : 'Desconocido';
    } catch (error) {
        console.error("Error al obtener nombre del usuario:", error);
        return 'Desconocido';
    }
}

// Actualizar datos de un usuario
export async function actualizarUsuario(id, data, usuarioResponsable) {
    try {
        const campos = [];
        const valores = [];

        if (data.nombre_usuario) {
            campos.push("nombre_usuario = ?");
            valores.push(data.nombre_usuario);
        }

        if (data.contrasena) {
            campos.push("contrasena = ?");
            valores.push(data.contrasena); // ⚠️ texto plano
        }

        if (data.rol_id !== undefined) {
            campos.push("rol_id = ?");
            valores.push(data.rol_id);
        }

        if (campos.length === 0) {
            throw new Error("No se proporcionaron datos para actualizar");
        }

        valores.push(id);

        const [result] = await pool.query(
            `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`,
            valores
        );

        if (result.affectedRows === 0) {
            return { message: "No se encontró el usuario para actualizar" };
        }

        const nombreUsuario = await obtenerNombreUsuario(id);

        await pool.query(
            'INSERT INTO actividad (accion, descripcion, usuario_id) VALUES (?, ?, ?)',
            ['EDITAR_USUARIO', `Se editó el usuario: ${nombreUsuario} (ID: ${id})`, usuarioResponsable]
        );

        return { message: "Usuario actualizado correctamente", id };
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return { message: `Error al actualizar el usuario: ${error.message}` };
    }
}

// Agregar nuevo usuario
export async function agregarUsuario({ nombre_usuario, contrasena, rol_id }, usuarioResponsable) {
    try {
        if (!nombre_usuario || !contrasena) {
            return { message: "El nombre de usuario y la contraseña son obligatorios" };
        }

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)',
            [nombre_usuario, contrasena, rol_id || 3]
        );

        const nombreRol = obtenerNombreRol(rol_id || 3);

        await pool.query(
            'INSERT INTO actividad (accion, descripcion, usuario_id) VALUES (?, ?, ?)',
            ['CREAR_USUARIO', `Se creó el usuario: ${nombre_usuario} con rol: ${nombreRol}`, usuarioResponsable]
        );

        return {
            id: result.insertId,
            nombre_usuario,
            rol_id: rol_id || 3,
            message: "Usuario creado exitosamente"
        };
    } catch (error) {
        console.error("Error al agregar usuario:", error);
        return { message: `Error al crear usuario: ${error.message}` };
    }
}

// Eliminar un usuario
export async function eliminarUsuario(id, usuarioResponsable) {
    try {
        const [usuarioRows] = await pool.query('SELECT nombre_usuario FROM usuarios WHERE id = ?', [id]);
        const nombreUsuario = usuarioRows.length > 0 ? usuarioRows[0].nombre_usuario : 'Desconocido';

        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            await pool.query(
                'INSERT INTO actividad (accion, descripcion, usuario_id) VALUES (?, ?, ?)',
                ['ELIMINAR_USUARIO', `Se eliminó el usuario: ${nombreUsuario} (ID: ${id})`, usuarioResponsable]
            );

            return { message: 'Usuario eliminado correctamente' };
        } else {
            return { message: 'Usuario no encontrado' };
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return { message: 'Error al eliminar el usuario' };
    }
}