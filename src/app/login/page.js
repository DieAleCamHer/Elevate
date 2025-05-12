'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(Date.now()); // esta es una clave una para reiniciar el form
  const router = useRouter();

  useEffect(() => {
    // Limpiar campos y cambiar la key al cargar
    setUsername('');
    setPassword('');
    setError('');
    setFormKey(Date.now()); // Fuerzo a que el form se reinicie
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setUsername('');
      setPassword('');
      setError('');
      setFormKey(Date.now()); // Cuando doy click en atrás tambn se reinicia
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      const q = query(collection(db, 'usuarios'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado.');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.username + '@empresa.com';
      const rol = userData.rol;

      await signInWithEmailAndPassword(auth, email, password);

      if (rol === 'admin') {
        router.push('/dashboard/admin');
      } else if (rol === 'gerente') {
        router.push('/dashboard/gerente');
      } else if (rol === 'miembro') {
        router.push('/dashboard/miembro');
      } else {
        setError('Rol desconocido.');
      }

    } catch (error) {
      console.error(error);
      setError('Credenciales incorrectas o problema de conexión.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form key={formKey} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
