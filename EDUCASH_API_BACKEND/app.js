import express from 'express'

const app = express()

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

export default app