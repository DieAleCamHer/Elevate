import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener una tarea específica por ID
export const GET = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [rows] = await pool.query('SELECT * FROM tareas_especificas WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Tarea específica no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener la tarea específica', details: error.message }, { status: 500 });
    }
};

// Actualizar una tarea específica por ID
export const PUT = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const body = await request.json();
        const { nombre, descripcion, estado, tarea_padre_id, asignado_a } = body;

        if (!nombre || !descripcion || !estado || !tarea_padre_id || !asignado_a) {
            return NextResponse.json({ error: 'Faltan datos para actualizar la tarea específica' }, { status: 400 });
        }

        const [result] = await pool.query(
            'UPDATE tareas_especificas SET nombre = ?, descripcion = ?, estado = ?, tarea_padre_id = ?, asignado_a = ? WHERE id = ?',
            [nombre, descripcion, estado, tarea_padre_id, asignado_a, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Tarea específica no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Tarea específica actualizada exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar la tarea específica', details: error.message }, { status: 500 });
    }
};

// Eliminar una tarea específica por ID
export const DELETE = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [result] = await pool.query('DELETE FROM tareas_especificas WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Tarea específica no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Tarea específica eliminada exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar la tarea específica', details: error.message }, { status: 500 });
    }
};
