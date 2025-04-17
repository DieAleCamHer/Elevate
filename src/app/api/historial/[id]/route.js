import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener un registro del historial por ID
export const GET = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [rows] = await pool.query('SELECT * FROM historial WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener el historial', details: error.message }, { status: 500 });
    }
};

// Actualizar un registro del historial por ID
export const PUT = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const body = await request.json();
        const { especifica_id, comentario, porcentaje, asignado_a } = body;

        if (!especifica_id || !comentario || porcentaje == null || !asignado_a) {
            return NextResponse.json({ error: 'Faltan datos para actualizar el historial' }, { status: 400 });
        }

        const [result] = await pool.query(
            'UPDATE historial SET especifica_id = ?, comentario = ?, porcentaje = ?, asignado_a = ? WHERE id = ?',
            [especifica_id, comentario, porcentaje, asignado_a, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Historial actualizado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el historial', details: error.message }, { status: 500 });
    }
};

// Eliminar un registro del historial por ID
export const DELETE = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [result] = await pool.query('DELETE FROM historial WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Registro de historial eliminado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el historial', details: error.message }, { status: 500 });
    }
};
