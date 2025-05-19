'use client';

import { useState } from 'react';

export default function QuitarMiembroTarea({ miembrosAsignados, miembrosProyecto, onEliminarMiembro, onCerrar }) {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('');

  const handleQuitar = () => {
    if (!miembroSeleccionado) {
      alert('Por favor, selecciona un miembro.');
      return;
    }

    onEliminarMiembro(miembroSeleccionado); // El padre ejecuta el fetch + actualiza estado
    onCerrar();
  };

  // Buscar nombre y username de cada miembro asignado
  const opciones = miembrosAsignados
    .map((id) => miembrosProyecto.find((m) => m.id === id))
    .filter(Boolean); // Elimina valores no encontrados

  return (
    <div>
      <select
        value={miembroSeleccionado}
        onChange={(e) => setMiembroSeleccionado(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          borderColor: 'purple',
        }}
      >
        <option value="">Seleccionar un miembro asignado</option>
        {opciones.map((miembro) => (
          <option key={miembro.id} value={miembro.id}>
            {miembro.nombre} ({miembro.username})
          </option>
        ))}
      </select>

      <button
        onClick={handleQuitar}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      >
        Quitar
      </button>
    </div>
  );
}
