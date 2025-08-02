 const express = require('express');
 const { connectDB } = require('./database/connection');
 require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuración de CORS
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todos los orígenes
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Métodos permitidos
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Si la solicitud es de tipo "OPTIONS" (preflight), responder con 200
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }

        next();
    });

    connectDB().then(() => {
        console.log("Conexión a la base de datos establecida");
        app.get('/', (req, res) => {
            res.send('Backend de Educash funcionando!');
        });

        app.listen(PORT, () => {
            console.log(`Servidor Educash escuchando en el puerto ${PORT}`);
        });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Algo salió mal en el servidor!');
    });

export default app;