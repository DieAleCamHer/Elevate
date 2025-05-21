'use client';

import { useEffect, useState } from 'react';
import ProyectoCard from '@/components/ProyectoCard';

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
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.warn('Faltan token o userId en localStorage');
        alert('Usuario no autenticado correctamente');
        return;
      }

      const res = await fetch(`/api/proyectos?userId=${userId}`, {
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

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.warn('Faltan token o userId en localStorage');
      alert('Usuario no autenticado correctamente');
      return;
    }

    if (!nombre || !descripcion || !fechaEntrega) {
      alert('Completa todos los campos');
      return;
    }

    try {
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
          creadorId: userId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Error detallado:', result);
        return alert('Error al crear proyecto: ' + (result.message || 'Error desconocido'));
      }

      // Limpiar formulario y recargar
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
