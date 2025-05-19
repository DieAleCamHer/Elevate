'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalAsignarMiembro from '@/components/ModalAsignarMiembro';
import ModalQuitarMiembro from '@/components/ModalQuitarMiembro';
import ModalVerMiembros from '@/components/ModalVerMiembros';
import { auth } from '@/firebaseConfig';

export default function ProyectoCard({ proyecto, recargar }) {
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [mostrarQuitar, setMostrarQuitar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);

  const router = useRouter();

  const eliminarProyecto = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch('/api/proyectos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
        <button onClick={() => setMostrarVer(true)}>Ver Miembros</button>
        <button>Ver Historial</button>
        <button onClick={() => router.push(`/dashboard/gerente/tareas/${proyecto.id}`)}>
          Ver Tareas
        </button>
      </div>

      {mostrarEliminar && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que deseas eliminar este proyecto?</p>
            <button onClick={eliminarProyecto}>Confirmar</button>
            <button onClick={() => setMostrarEliminar(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {mostrarAsignar && (
        <ModalAsignarMiembro
          proyectoId={proyecto.id}
          cerrarModal={() => setMostrarAsignar(false)}
          recargar={recargar}
        />
      )}

      {mostrarQuitar && (
        <ModalQuitarMiembro
          proyectoId={proyecto.id}
          cerrarModal={() => setMostrarQuitar(false)}
          recargar={recargar}
        />
      )}

      {mostrarVer && (
        <ModalVerMiembros
          proyectoId={proyecto.id}
          cerrarModal={() => setMostrarVer(false)}
          recargar={recargar}
        />
      )}
    </div>
  );
}
