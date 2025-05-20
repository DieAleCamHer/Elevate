import { useState, useEffect } from 'react';
import { auth } from '@/firebaseConfig';

export default function ModalVerMiembros({ proyectoId, cerrarModal }) {
  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    cargarMiembrosAsignados();
  }, []);

  const cargarMiembrosAsignados = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken(true);

      const resProyecto = await fetch(`/api/proyectos?proyectoId=${proyectoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const proyectoData = await resProyecto.json();

      if (!proyectoData.miembros || proyectoData.miembros.length === 0) {
        setMiembros([]);
        return;
      }

      const resUsuarios = await fetch('/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const usuariosData = await resUsuarios.json();

      const miembrosAsignados = usuariosData
        .filter(user => proyectoData.miembros.includes(user.id))
        .map(user => ({
          id: user.id,
          nombre: user.nombre || 'Sin nombre',
          username: user.username || 'sin-usuario',
        }));

      setMiembros(miembrosAsignados);
    } catch (error) {
      console.error('Error al cargar los miembros del proyecto:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Miembros Asignados</h2>
        {miembros.length > 0 ? (
          <ul style={{ textAlign: 'left', marginTop: '15px' }}>
            {miembros.map(miembro => (
              <li key={miembro.id}>
                {miembro.nombre} ({miembro.username})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay miembros asignados.</p>
        )}
        <div style={{ marginTop: '20px' }}>
          <button onClick={cerrarModal}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
