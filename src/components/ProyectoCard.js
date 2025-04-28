'use client';

import { useState } from 'react';
import ModalAsignarMiembro from '@/components/ModalAsignarMiembro';//Aqui no olvidar importaciones de components
import ModalQuitarMiembro from '@/components/ModalQuitarMiembro';

export default function ProyectoCard({ proyecto, recargar }) {
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarAsignar, setMostrarAsignar] = useState(false); //Controlo aqui el modal de asignar
  const [mostrarQuitar, setMostrarQuitar] = useState(false);

  const eliminarProyecto = async () => {
    try {
      const res = await fetch('/api/proyectos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proyectoId: proyecto.id })
      });

      if (res.ok) {
        recargar();
      } else {
        alert('Error al eliminar proyecto');
      }
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  return (
    <div className="card">
      <h3>{proyecto.nombre}</h3>
      <p>{proyecto.descripcion}</p>
      <p><strong>Fecha de Entrega:</strong> {proyecto.fechaEntrega?.seconds ? new Date(proyecto.fechaEntrega.seconds * 1000).toLocaleDateString() : proyecto.fechaEntrega}</p>

      <div className="card-buttons">
        <button onClick={() => setMostrarEliminar(true)}>Eliminar Proyecto</button>
        <button onClick={() => setMostrarAsignar(true)}>Asignar Miembros</button>
        <button onClick={() => setMostrarQuitar(true)}>Quitar Miembros</button>
        <button>Ver Miembros</button>
        <button>Ver Historial</button>
        <button>Ver Tareas</button>
      </div>

      {/* Modal eliminar */}
      {mostrarEliminar && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que deseas eliminar este proyecto?</p>
            <button onClick={eliminarProyecto}>Confirmar</button>
            <button onClick={() => setMostrarEliminar(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal asignar miembros */}
      {mostrarAsignar && (
        <ModalAsignarMiembro
          proyectoId={proyecto.id}
          cerrarModal={() => setMostrarAsignar(false)}
          recargar={recargar}
        />
      )}

      {/* Modal mostrar miembros */}
      {mostrarQuitar && (
        <ModalQuitarMiembro
            proyectoId={proyecto.id}
            cerrarModal={() => setMostrarQuitar(false)}
           recargar={recargar}
        />
        )}
    </div>
  );
}
