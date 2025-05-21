'use client';

import { useState, useEffect } from 'react';

export default function ModalQuitarMiembro({ proyectoId, cerrarModal, recargar }) {
  const [miembrosAsignados, setMiembrosAsignados] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('');

  useEffect(() => {
    cargarMiembrosAsignados();
  }, []);

  const cargarMiembrosAsignados = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const resProyecto = await fetch(`/api/proyectos?proyectoId=${proyectoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataProyecto = await resProyecto.json();

      if (!dataProyecto.miembros || dataProyecto.miembros.length === 0) {
        setMiembrosAsignados([]);
        return;
      }

      const resUsuarios = await fetch('/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const usuarios = await resUsuarios.json();

      const asignados = usuarios
        .filter(u => dataProyecto.miembros.includes(u.id))
        .map(u => ({
          id: u.id,
          nombre: u.nombre || 'Sin nombre',
          username: u.username || 'sin-usuario',
        }));

      setMiembrosAsignados(asignados);
    } catch (error) {
      console.error('Error al cargar miembros asignados:', error);
    }
  };

  const quitarMiembro = async () => {
    if (!miembroSeleccionado) return alert('Selecciona un miembro');

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Token no encontrado');

      const res = await fetch('/api/proyectos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'quitar',
          proyectoId,
          miembroId: miembroSeleccionado,
        }),
      });

      if (res.ok) {
        recargar();
        cerrarModal();
      } else {
        alert('Error al quitar miembro');
      }
    } catch (error) {
      console.error('Error al quitar miembro:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Quitar Miembro del Proyecto</h2>
        {miembrosAsignados.length > 0 ? (
          <>
            <select
              value={miembroSeleccionado}
              onChange={(e) => setMiembroSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un miembro asignado</option>
              {miembrosAsignados.map((miembro) => (
                <option key={miembro.id} value={miembro.id}>
                  {miembro.nombre} ({miembro.username})
                </option>
              ))}
            </select>
            <div style={{ marginTop: '20px' }}>
              <button onClick={quitarMiembro}>Quitar</button>
              <button onClick={cerrarModal} style={{ marginLeft: '10px' }}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p>No hay miembros asignados.</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
