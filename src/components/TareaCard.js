'use client';

import { useState } from 'react';

export default function TareaCard({ tarea, onEliminar, onVerSubtareas }) {
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  return (
    <div className="card">
      <h3>{tarea.nombre}</h3>
      <p>{tarea.descripcion}</p>

      <div className="card-buttons">
        <button onClick={() => setMostrarEliminar(true)}>Eliminar</button>
        <button onClick={() => onVerSubtareas(tarea.id)}>Ver Subtareas</button>
      </div>

      {mostrarEliminar && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que deseas eliminar esta tarea?</p>
            <button onClick={() => onEliminar(tarea.id)}>Confirmar</button>
            <button onClick={() => setMostrarEliminar(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
