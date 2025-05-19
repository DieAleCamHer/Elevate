'use client';

import { useState } from 'react';
import MiembrosTarea from './MiembrosTarea';
import MiembroModal from './MiembroModal';
import QuitarMiembroTarea from './QuitarMiembroTarea';
import { auth } from '@/firebaseConfig';

export default function TareaCard({ tarea, onEliminar, onVerSubtareas, miembrosProyecto }) {
  const [mostrarMiembros, setMostrarMiembros] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [miembrosAsignados, setMiembrosAsignados] = useState(tarea.miembrosAsignados || []);

  const handleEliminarTarea = () => {
    onEliminar(tarea.id);
    setMostrarEliminar(false);
  };

  const handleAsignarMiembro = async (miembroId) => {
    if (!miembroId || miembrosAsignados.includes(miembroId)) return;

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch(`/api/tareas/${tarea.id}/miembros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tareaId: tarea.id,
          proyectoId: tarea.proyectoId,
          miembroId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMiembrosAsignados((prev) => [...prev, miembroId]);
    } catch (error) {
      console.error('Error al asignar miembro:', error);
      alert('Error al asignar miembro');
    }
  };

  const eliminarMiembro = async (miembroId) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch(`/api/tareas/${tarea.id}/miembros`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ miembroId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMiembrosAsignados((prev) => prev.filter((id) => id !== miembroId));
    } catch (error) {
      console.error('Error al eliminar miembro:', error);
      alert('Error al eliminar miembro');
    }
  };

  return (
    <div className="card">
      <h3>{tarea.nombre}</h3>
      <p>{tarea.descripcion}</p>

      <div className="card-buttons">
        <button onClick={() => setMostrarEliminar(true)}>Eliminar Tarea</button>
        <button onClick={() => setMostrarMiembros((v) => v === 'asignar' ? null : 'asignar')}>Asignar Miembros</button>
        <button onClick={() => setMostrarMiembros((v) => v === 'quitar' ? null : 'quitar')}>Quitar Miembros</button>
        <button onClick={() => setMostrarMiembros((v) => v === 'ver' ? null : 'ver')}>Ver Miembros</button>
        <button onClick={onVerSubtareas}>Ver Subtareas</button>
      </div>

      {mostrarMiembros === 'asignar' && (
        <MiembroModal titulo="Asignar Miembro a la Tarea" onCerrar={() => setMostrarMiembros(null)}>
          <MiembrosTarea
            tareaId={tarea.id}
            proyectoId={tarea.proyectoId}
            miembrosProyecto={miembrosProyecto}
            onAsignarMiembro={handleAsignarMiembro}
            onEliminarMiembro={eliminarMiembro}
            onCerrar={() => setMostrarMiembros(null)}
          />
        </MiembroModal>
      )}

      {mostrarMiembros === 'ver' && (
        <MiembroModal titulo="Miembros Asignados" onCerrar={() => setMostrarMiembros(null)}>
          <ul>
            {miembrosAsignados.map((miembroId) => {
              const miembro = miembrosProyecto.find((m) => m.id === miembroId);
              return miembro && <li key={miembro.id}>{miembro.nombre} ({miembro.username})</li>;
            })}
          </ul>
        </MiembroModal>
      )}

      {mostrarMiembros === 'quitar' && (
        <MiembroModal titulo="Quitar Miembro de la Tarea" onCerrar={() => setMostrarMiembros(null)}>
          <QuitarMiembroTarea
            miembrosAsignados={miembrosAsignados}
            miembrosProyecto={miembrosProyecto}
            onEliminarMiembro={eliminarMiembro}
            onCerrar={() => setMostrarMiembros(null)}
          />
        </MiembroModal>
      )}

      {mostrarEliminar && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que deseas eliminar esta tarea?</p>
            <button onClick={handleEliminarTarea}>Confirmar</button>
            <button onClick={() => setMostrarEliminar(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
