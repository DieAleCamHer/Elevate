import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los usuarios', details: error.message },
            { status: 500 }
        );
    }
};

export const POST = async (request) => {
    try {
        const body = await request.json();
        const { nombre_usuario, contrasena, rol_id } = body;

        if (!nombre_usuario || !contrasena || !rol_id) {
            return NextResponse.json(
                { error: 'Faltan datos: nombre_usuario, contrasena y rol_id son requeridos' },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, contrasena, rol_id) VALUES (?, ?, ?)',
            [nombre_usuario, contrasena, rol_id]
        );

        return NextResponse.json({
            message: 'Usuario creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('ERROR POST:', error); // <-- Aquí se imprime en terminal
        return NextResponse.json(
            { error: 'Error interno', details: error.message },
            { status: 500 }
        );
    }
};