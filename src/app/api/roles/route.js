import { NextResponse } from "next/server";
import { pool } from "@/config/db.js";

// Obtener todos los roles
export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles');
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los roles', details: error.message },
            { status: 500 }
        );
    }
};
