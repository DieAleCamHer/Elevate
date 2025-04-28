import '@/styles/globals.css';

export const metadata = {
  title: 'Plataforma Elevate',
  description: 'Sistema de gestión de proyectos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
