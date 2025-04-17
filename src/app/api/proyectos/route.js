import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";
//FALTA LA PARTE DE MIDDLEWARE PARA AUTENTICAR
// Obtener todos los proyectos
export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM proyectos');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los proyectos', details: error.message },
            { status: 500 }
        );
    }
};

// Crear un nuevo proyecto
export const POST = async (request) => {
    try {
        const body = await request.json();
        const { nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = body;

        // Validación básica
        if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !gerente_id) {
            return NextResponse.json(
                { error: 'Faltan datos: todos los campos son requeridos (excepto el ID)' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            'INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, gerente_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, fecha_inicio, fecha_fin, gerente_id]
        );

        return NextResponse.json({
            message: 'Proyecto creado exitosamente',
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
