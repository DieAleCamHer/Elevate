'use client';

import { useEffect, useState } from 'react';

export default function SubtareasPage({ idTarea }) {
  const [subtareas, setSubtareas] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (idTarea) cargarSubtareas();
  }, [idTarea]);

  const cargarSubtareas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return console.warn('Token no encontrado');

      const res = await fetch(`/api/subtareas?tareaId=${idTarea}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error al cargar subtareas:', error.message);
        return;
      }

      const data = await res.json();
      setSubtareas(data);
    } catch (error) {
      console.error('Error al cargar subtareas:', error);
    }
  };

  const crearSubtarea = async () => {
    if (!nombre.trim()) return alert('Escribe un nombre válido.');

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Token no encontrado');

      const res = await fetch('/api/subtareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, tareaId: idTarea }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Error al crear subtarea');
        return;
      }

      setNombre('');
      cargarSubtareas();
    } catch (error) {
      console.error('Error al crear subtarea:', error);
    }
  };

  const eliminarSubtarea = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Token no encontrado');

      const res = await fetch('/api/subtareas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subtareaId: id }),
      });

      if (!res.ok) {
        alert('Error al eliminar subtarea');
        return;
      }

      cargarSubtareas();
    } catch (error) {
      console.error('Error al eliminar subtarea:', error);
    }
  };

  return (
    <div className="container">
      <h1>Subtareas</h1>

      <input
        type="text"
        placeholder="Nombre de la subtarea"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={crearSubtarea}>Crear Subtarea</button>

      <ul>
        {subtareas.length === 0 ? (
          <li>No hay subtareas para esta tarea.</li>
        ) : (
          subtareas.map((sub) => (
            <li key={sub.id}>
              {sub.nombre}
              <button onClick={() => eliminarSubtarea(sub.id)} style={{ marginLeft: 10 }}>
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
