import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener todas las tareas
export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM tareas');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener las tareas', details: error.message },
            { status: 500 }
        );
    }
};

// Crear una nueva tarea
export const POST = async (request) => {
    try {
        const body = await request.json();
        const { nombre, descripcion, estado, porcentaje_avance, proyecto_id, asignado_a } = body;

        // Validar que todos los campos estén presentes
        if (!nombre || !descripcion || !estado || porcentaje_avance == null || !proyecto_id || !asignado_a) {
            return NextResponse.json(
                { error: 'Faltan datos: nombre, descripcion, estado, porcentaje_avance, proyecto_id y asignado_a son requeridos' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            'INSERT INTO tareas (nombre, descripcion, estado, porcentaje_avance, proyecto_id, asignado_a) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, estado, porcentaje_avance, proyecto_id, asignado_a]
        );

        return NextResponse.json({
            message: 'Tarea creada exitosamente',
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
