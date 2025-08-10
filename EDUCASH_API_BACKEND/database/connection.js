import sql from 'mssql';

const dbSettings = { 
    user: "sa",
    password: "UTH2017",
    server: "DESKTOP-6H94ODJ",
    database: "EDUCASHDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        port: 1433,
    }
};

const pool = new sql.ConnectionPool(dbSettings);
const poolConnect = pool.connect();

export const getConnection = async () => {
    try {
        await poolConnect;
        console.log("Conexión a la base de datos establecida correctamente");
        return pool;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
};

export { sql };