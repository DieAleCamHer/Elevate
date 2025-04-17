import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener todos los registros del historial
export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM historial');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener el historial', details: error.message },
            { status: 500 }
        );
    }
};

// Agregar nuevo comentario al historial
export const POST = async (request) => {
    try {
        const body = await request.json();
        const { especifica_id, comentario, porcentaje, asignado_a } = body;

        // Validación básica
        if (!especifica_id || !comentario || porcentaje == null || !asignado_a) {
            return NextResponse.json(
                { error: 'Faltan datos: especifica_id, comentario, porcentaje y asignado_a son requeridos' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            'INSERT INTO historial (especifica_id, comentario, porcentaje, asignado_a) VALUES (?, ?, ?, ?)',
            [especifica_id, comentario, porcentaje, asignado_a]
        );

        return NextResponse.json({
            message: 'Comentario agregado al historial exitosamente',
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
