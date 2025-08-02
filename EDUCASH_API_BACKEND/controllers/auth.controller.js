const { getConnection, sql } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, clave } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Email', sql.VarChar(100), email)
            .input('Clave', sql.VarChar(255), clave)
            .execute('sp_AutenticarUsuario');

        const data = result.recordset[0];

        if (data.Resultado === 'Éxito') {
            const token = jwt.sign({ id: data.Id_Usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ ...data, token });
        } else {
            res.status(400).json(data);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
