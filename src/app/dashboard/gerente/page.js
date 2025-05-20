'use client';

import { useEffect, useState } from 'react';
import ProyectoCard from '@/components/ProyectoCard';
import { auth } from '@/firebaseConfig';

export default function GerenteDashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return console.warn('Usuario no autenticado');

      const token = await user.getIdToken(true);
      const res = await fetch(`/api/proyectos?userId=${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error al cargar proyectos:', error);
        return;
      }

      const data = await res.json();
      setProyectos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error inesperado al cargar proyectos:', error);
    }
  };

  const crearProyecto = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !fechaEntrega) return alert('Completa todos los campos');

    const user = auth.currentUser;
    if (!user) return alert('Usuario no autenticado correctamente');

    try {
      const token = await user.getIdToken(true);
      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          fechaEntrega,
          creadorId: user.uid,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Error detallado:', result);
        return alert('Error al crear proyecto: ' + (result.message || 'Error desconocido'));
      }

      setNombre('');
      setDescripcion('');
      setFechaEntrega('');
      cargarProyectos();
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      alert('Error inesperado al crear proyecto');
    }
  };

  return (
    <div className="container">
      <h1>Gestión de Proyectos</h1>

      <form onSubmit={crearProyecto} className="form-proyecto">
        <input
          type="text"
          placeholder="Nombre del Proyecto"
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
        <input
          type="date"
          placeholder="Fecha de Entrega"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          required
        />
        <button type="submit">Crear Proyecto</button>
      </form>

      <div className="proyectos-grid">
        {proyectos.length === 0 ? (
          <p>No hay proyectos.</p>
        ) : (
          proyectos.map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} recargar={cargarProyectos} />
          ))
        )}
      </div>
    </div>
  );
}
