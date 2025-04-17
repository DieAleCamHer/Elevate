import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener una tarea por ID
export const GET = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [rows] = await pool.query('SELECT * FROM tareas WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener la tarea', details: error.message }, { status: 500 });
    }
};

// Actualizar una tarea por ID
export const PUT = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const body = await request.json();
        const { nombre, descripcion, estado, porcentaje_avance, proyecto_id, asignado_a } = body;

        if (!nombre || !descripcion || !estado || porcentaje_avance == null || !proyecto_id || !asignado_a) {
            return NextResponse.json({ error: 'Faltan datos para actualizar la tarea' }, { status: 400 });
        }

        const [result] = await pool.query(
            'UPDATE tareas SET nombre = ?, descripcion = ?, estado = ?, porcentaje_avance = ?, proyecto_id = ?, asignado_a = ? WHERE id = ?',
            [nombre, descripcion, estado, porcentaje_avance, proyecto_id, asignado_a, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Tarea actualizada exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar la tarea', details: error.message }, { status: 500 });
    }
};

// Eliminar una tarea por ID
export const DELETE = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [result] = await pool.query('DELETE FROM tareas WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar la tarea', details: error.message }, { status: 500 });
    }
};
