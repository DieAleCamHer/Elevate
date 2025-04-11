// src/pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [hora, setHora] = useState('');

  useEffect(() => {
    const horaActual = new Date().toLocaleTimeString();
    setHora(horaActual);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>¡Bienvenido Kevin! 🎉</h1>
      <p>Tu aplicación está corriendo correctamente ✅</p>
      {hora && <p>Hora actual: {hora}</p>}
    </div>
  );
}
