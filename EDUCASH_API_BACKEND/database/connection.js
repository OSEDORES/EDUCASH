import sql from 'mssql'

const dbSettings = { 
    user: "sa",
    password:"UTH2017",
    server: "DESKTOP-6H94ODJ",
    database:"EDUCASHDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        port: 1433,
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings)
        console.log("Conexión a la base de datos establecida correctamente");
        return pool;
        
    } catch (error) {
        console.error(error); 
        throw error;       
    }
}