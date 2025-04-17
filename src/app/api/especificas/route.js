import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener todas las tareas específicas
export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM tareas_especificas');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener las tareas específicas', details: error.message },
            { status: 500 }
        );
    }
};

// Crear una nueva tarea específica
export const POST = async (request) => {
    try {
        const body = await request.json();
        const { nombre, descripcion, estado, tarea_padre_id, asignado_a } = body;

        // Validación básica
        if (!nombre || !descripcion || !estado || !tarea_padre_id || !asignado_a) {
            return NextResponse.json(
                { error: 'Faltan datos: nombre, descripcion, estado, tarea_padre_id y asignado_a son requeridos' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            'INSERT INTO tareas_especificas (nombre, descripcion, estado, tarea_padre_id, asignado_a) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, estado, tarea_padre_id, asignado_a]
        );

        return NextResponse.json({
            message: 'Tarea específica creada exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('ERROR POST:', error);
        return NextResponse.json(
            { error: 'Error interno', details: error.message },
            { status: 500 }
        );
    }
};
