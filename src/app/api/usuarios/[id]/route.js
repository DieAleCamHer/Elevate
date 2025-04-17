import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener un usuario por ID
export const GET = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener el usuario', details: error.message }, { status: 500 });
    }
};

// Actualizar un usuario por ID
export const PUT = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const body = await request.json();
        const { nombre_usuario, contrasena, rol_id } = body;

        if (!nombre_usuario || !contrasena || !rol_id) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        const [result] = await pool.query(
            'UPDATE usuarios SET nombre_usuario = ?, contrasena = ?, rol_id = ? WHERE id = ?',
            [nombre_usuario, contrasena, rol_id, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el usuario', details: error.message }, { status: 500 });
    }
};

// Eliminar un usuario por ID
export const DELETE = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el usuario', details: error.message }, { status: 500 });
    }
};
