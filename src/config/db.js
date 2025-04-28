const mysql = require('mysql2');

// Configurar la conexión
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elevate_gestor',
  port: 3307
});

// Probar la conexión
conexion.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }

});