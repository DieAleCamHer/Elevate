'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCard from '@/components/TareaCard';
import { auth } from '@/firebaseConfig';

export default function TareasProyectoPage({ params }) {
  const { idProyecto } = params;
  const [tareas, setTareas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const cargarTareas = async () => {
    try {
      const res = await fetch(`/api/tareas?proyectoId=${idProyecto}`);
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const crearTarea = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert('Completa todos los campos');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    try {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          creadorId: user.uid,
          proyectoId: idProyecto
        })
      });

      if (res.ok) {
        setNombre('');
        setDescripcion('');
        cargarTareas();
      } else {
        alert('Error al crear tarea');
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  return (
    <div className="container">
      <h1>Gestión de Tareas</h1>

      <form onSubmit={crearTarea} className="form-proyecto">
        <input
          type="text"
          placeholder="Nombre de la Tarea"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Crear Tarea</button>
      </form>

      <div className="proyectos-grid">
        {tareas.map((tarea) => (
          <TareaCard key={tarea.id} tarea={tarea} recargar={cargarTareas} />
        ))}
      </div>
    </div>
  );
}