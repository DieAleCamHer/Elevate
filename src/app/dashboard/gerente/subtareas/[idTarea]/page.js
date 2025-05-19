'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';

export default function SubtareasPage({ params }) {
  const { idTarea } = params;
  const [subtareas, setSubtareas] = useState([]);
  const [nombre, setNombre] = useState('');
  const router = useRouter();

  useEffect(() => {
    cargarSubtareas();
  }, []);

  const cargarSubtareas = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch(`/api/subtareas?tareaId=${idTarea}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setSubtareas(data);
    } catch (error) {
      console.error('Error al cargar subtareas:', error);
    }
  };

  const crearSubtarea = async () => {
    if (!nombre) return;

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch('/api/subtareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, tareaId: idTarea })
      });

      const data = await res.json();
      if (res.ok) {
        setNombre('');
        cargarSubtareas();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al crear subtarea:', error);
    }
  };

  const eliminarSubtarea = async (id) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch('/api/subtareas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subtareaId: id })
      });

      if (res.ok) cargarSubtareas();
      else alert('Error al eliminar subtarea');
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
        {subtareas.map((sub) => (
          <li key={sub.id}>
            {sub.nombre}
            <button onClick={() => eliminarSubtarea(sub.id)} style={{ marginLeft: 10 }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
