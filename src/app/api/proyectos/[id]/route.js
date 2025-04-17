import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";
//FALTA LA PARTE DE MIDDLEWARE PARA AUTENTICAR
// Obtener un proyecto por ID
export const GET = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [rows] = await pool.query('SELECT * FROM proyectos WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener el proyecto', details: error.message }, { status: 500 });
    }
};

// Actualizar un proyecto por ID
export const PUT = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const body = await request.json();
        const { nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = body;

        if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !gerente_id) {
            return NextResponse.json({ error: 'Faltan datos para actualizar el proyecto' }, { status: 400 });
        }

        const [result] = await pool.query(
            'UPDATE proyectos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, gerente_id = ? WHERE id = ?',
            [nombre, descripcion, fecha_inicio, fecha_fin, gerente_id, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Proyecto actualizado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el proyecto', details: error.message }, { status: 500 });
    }
};

// Eliminar un proyecto por ID
export const DELETE = async (request) => {
    const id = request.nextUrl.pathname.split("/").pop();
    try {
        const [result] = await pool.query('DELETE FROM proyectos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el proyecto', details: error.message }, { status: 500 });
    }
};
