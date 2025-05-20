'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/firebaseConfig';

export default function ModalAsignarMiembro({ proyectoId, cerrarModal, recargar }) {
  const [miembros, setMiembros] = useState([]);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('');

  useEffect(() => {
    cargarMiembros();
  }, []);

  const cargarMiembros = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken(true);

      const res = await fetch('/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMiembros(data.filter(usuario => usuario.rol === 'miembro'));
    } catch (error) {
      console.error('Error al cargar miembros:', error);
    }
  };

  const asignarMiembro = async () => {
    if (!miembroSeleccionado) return alert('Selecciona un miembro');

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken(true);

      const res = await fetch('/api/proyectos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'asignar',
          proyectoId,
          miembroId: miembroSeleccionado,
        }),
      });

      if (res.ok) {
        recargar();
        cerrarModal();
      } else {
        alert('Error al asignar miembro');
      }
    } catch (error) {
      console.error('Error al asignar miembro:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Asignar Miembro al Proyecto</h2>
        <select
          value={miembroSeleccionado}
          onChange={(e) => setMiembroSeleccionado(e.target.value)}
        >
          <option value="">Selecciona un miembro</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>
              {miembro.nombre} ({miembro.username})
            </option>
          ))}
        </select>
        <div style={{ marginTop: '20px' }}>
          <button onClick={asignarMiembro}>Asignar</button>
          <button onClick={cerrarModal} style={{ marginLeft: '10px' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
