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
      if (!user) return;

      const res = await fetch(`/api/proyectos?userId=${user.uid}`);
      const data = await res.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const crearProyecto = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !fechaEntrega) {
      alert('Completa todos los campos');
      return;
    }

    const user = auth.currentUser; // Es para traer el usuario autenticado
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    try {
      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          fechaEntrega,
          creadorId: user.uid
        })
      });

      if (res.ok) {
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        cargarProyectos(); // Aqui se recargan los proyectos despues de crea uno nuevo
      } else {
        alert('Error al crear proyecto');
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
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
        {proyectos.map((proyecto) => (
          <ProyectoCard key={proyecto.id} proyecto={proyecto} recargar={cargarProyectos} />
        ))}
      </div>
    </div>
  );
}
