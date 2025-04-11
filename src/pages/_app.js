// src/pages/_app.js
import '@/styles/global.css'; // Asegúrate que este archivo existe

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
