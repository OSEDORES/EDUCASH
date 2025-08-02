    const sql = require('mssql');
    require('dotenv').config();

    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true, 
            trustServerCertificate: true  
        }
    };

    async function connectDB() {
        try {
            await sql.connect(config);
            console.log('Conexión a SQL Server establecida correctamente.');
            return sql;
        } catch (err) {
            console.error('Error al conectar a SQL Server:', err);
            process.exit(1);
        }
    }

    module.exports = {
        sql,
        connectDB
    };
    