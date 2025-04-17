import * as mysql from 'mysql2/promise';

//Traemos los datos de la bd
export const pool = mysql.createPool ({
    host: 'localhost',
    user:'root',
    password:'',
    database:'elevate_gestor',
    port:'3307'
});

// Prueba la conexión
(async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Conectado a la base de datos');
      connection.release();
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error.message);
    }
  })();