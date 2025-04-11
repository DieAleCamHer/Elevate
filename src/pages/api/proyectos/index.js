import { pool } from '@/config/db';

export default async function handler(req, res) {
    
    const userRoleId = req.method === 'GET'
        ? parseInt(req.headers['rol_id'])
        : parseInt(req.body.rol_id);

    //Acá es el acceso a los administradores == 1 y a los gerentes == 2
    if (userRoleId !== 1 && userRoleId !== 2) {
        return res.status(403).json({ error: 'Acceso denegado. Solo los gerentes y administradores pueden gestionar proyectos.' });
    }

    switch (req.method) {
        case 'GET':
            try {
                const [proyectos] = await pool.query('SELECT * FROM proyectos');
                res.status(200).json(proyectos);
            } catch (error) {
                console.error('Error al obtener proyectos:', error);
                res.status(500).json({ message: 'Error al obtener proyectos' });
            }
            break;

        case 'POST':
            try {
                const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;

                if (!nombre || !descripcion || !fecha_inicio || !fecha_fin) {
                    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
                }

                const [result] = await pool.query(
                    'INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
                    [nombre, descripcion, fecha_inicio, fecha_fin]
                );

                res.status(201).json({ id: result.insertId, message: 'Proyecto creado correctamente' });
            } catch (error) {
                console.error('Error al crear proyecto:', error);
                res.status(500).json({ message: 'Error al crear proyecto' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Método ${req.method} no permitido`);
            break;
    }
}