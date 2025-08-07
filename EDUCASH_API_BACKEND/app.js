import express from 'express'
/*import authRoutes from './routes/auth.routes.js'*/
/*import presupuestosRoutes from './routes/presupuestos.routes.js'*/
/*import tipsRoutes from './routes/tips.routes.js'*/
import transaccionesRoutes from './routes/transacciones.routes.js';
/*import usuariosRoutes from './routes/usuarios.routes.js'*/

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

    /*app.use('/api/auth', authRoutes);*/
    /*app.use('/api/presupuestos', presupuestosRoutes);*/
    /*app.use('/api/tips', tipsRoutes);*/
    app.use('/api', transaccionesRoutes);
    /*app.use('/api/usuarios', usuariosRoutes);*/


export default app;