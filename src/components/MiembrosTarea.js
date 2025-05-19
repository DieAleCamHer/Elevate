'use client';

import { useState } from 'react';

export default function MiembrosTarea({ miembrosProyecto, onAsignarMiembro, onCerrar }) {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('');

  const handleAsignarMiembro = () => {
    if (!miembroSeleccionado) {
      alert('Por favor, selecciona un miembro.');
      return;
    }

    onAsignarMiembro(miembroSeleccionado); // El padre hará el fetch y actualiza Firestore + estado
    onCerrar(); // Cierra el modal
  };

  return (
    <div>
      <select
        value={miembroSeleccionado}
        onChange={(e) => setMiembroSeleccionado(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', borderColor: 'purple' }}
      >
        <option value="">Seleccionar miembro</option>
        {miembrosProyecto.map((miembro) => (
          <option key={miembro.id} value={miembro.id}>
            {miembro.nombre} ({miembro.username})
          </option>
        ))}
      </select>

      <button onClick={handleAsignarMiembro} style={{ display: 'block', width: '100%', marginBottom: '10px' }}>
        Asignar
      </button>
    </div>
  );
}
