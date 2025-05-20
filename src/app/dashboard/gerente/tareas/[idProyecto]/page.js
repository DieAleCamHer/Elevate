'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TareaCard from '@/components/TareaCard';
import { auth } from '@/firebaseConfig';

export default function TareasProyectoPage() {
  const params = useParams();
  const idProyecto = params.idProyecto;
  const [tareas, setTareas] = useState([]);
  const [nombreTarea, setNombreTarea] = useState('');
  const [descripcionTarea, setDescripcionTarea] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [miembrosProyecto, setMiembrosProyecto] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (idProyecto) {
      cargarTareas();
      cargarMiembros();
    }
  }, [idProyecto]);

  const cargarTareas = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/tareas?proyectoId=${idProyecto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const cargarMiembros = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/proyectos?proyectoId=${idProyecto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      const miembrosIds = data.miembros || [];

      const miembrosConDatos = await Promise.all(
        miembrosIds.map(async (id) => {
          const resUsuario = await fetch(`/api/usuarios?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!resUsuario.ok) return { id, nombre: 'Desconocido', username: 'desconocido' };

          const usuario = await resUsuario.json();
          return {
            id,
            nombre: usuario.nombre || 'Sin nombre',
            username: usuario.username || 'sin-usuario'
          };
        })
      );

      setMiembrosProyecto(miembrosConDatos);
    } catch (error) {
      console.error('Error al cargar los miembros:', error);
    }
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    if (!nombreTarea || !descripcionTarea) return alert('Completa todos los campos');

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nombreTarea, descripcion: descripcionTarea, proyectoId: idProyecto })
      });

      if (res.ok) {
        setNombreTarea('');
        setDescripcionTarea('');
        setMostrarFormulario(false);
        cargarTareas();
      } else {
        const error = await res.json();
        alert(error.message || 'Error al crear tarea');
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const eliminar = async (tareaId) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/tareas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tareaId })
      });

      if (!res.ok) throw new Error('Error al eliminar la tarea');
      cargarTareas();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const verSubtareas = (tareaId) => {
    router.push(`/dashboard/gerente/subtareas/${tareaId}`);
  };

  return (
    <div className="container">
      <h1>Tareas del Proyecto</h1>

      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? 'Cancelar' : 'Crear Tarea'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleCrearTarea}>
          <input type="text" placeholder="Nombre de la tarea" value={nombreTarea} onChange={(e) => setNombreTarea(e.target.value)} />
          <textarea placeholder="Descripción" value={descripcionTarea} onChange={(e) => setDescripcionTarea(e.target.value)} />
          <button type="submit">Crear Tarea</button>
        </form>
      )}

      {tareas.length > 0 ? (
        tareas.map((tarea) => (
          <TareaCard key={tarea.id} tarea={tarea} miembrosProyecto={miembrosProyecto} onEliminar={eliminar} onVerSubtareas={() => verSubtareas(tarea.id)} />
        ))
      ) : (
        <p>No hay tareas para este proyecto.</p>
      )}
    </div>
  );
}
