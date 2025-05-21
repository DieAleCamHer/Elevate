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
  const [formKey, setFormKey] = useState(Date.now());
  const router = useRouter();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setError('');
    setFormKey(Date.now());
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setUsername('');
      setPassword('');
      setError('');
      setFormKey(Date.now());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      // Buscar en la colección usuarios el documento por username
      const q = query(collection(db, 'usuarios'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = `${userData.username}@empresa.com`;
      const rol = userData.rol;

      // Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener token y guardar token + UID en localStorage
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.uid);

      // Opcional: puedes verificar el rol llamando a tu backend si lo necesitas

      // Redirigir según el rol
      switch (rol) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'gerente':
          router.push('/dashboard/gerente');
          break;
        case 'miembro':
          router.push('/dashboard/miembro');
          break;
        default:
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
