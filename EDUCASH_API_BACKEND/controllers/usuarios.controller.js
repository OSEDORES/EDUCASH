import { getConnection, sql } from '../database/connection.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .execute('GET_ObtenerUsuarios');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .execute('GET_ObtenerUsuarioPorId');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

// Registrar un nuevo usuario
export const registerUsuario = async (req, res) => {
  try {
    const { Email, Clave, NombreUsuario, FotoPerfil } = req.body;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('Email', sql.VarChar(100), Email)
      .input('Clave', sql.VarChar(255), Clave)
      .input('NombreUsuario', sql.VarChar(100), NombreUsuario)
      .input('FotoPerfil', sql.VarChar(255), FotoPerfil || null)
      .execute('POST_RegistrarUsuario');

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// Autenticar un usuario
export const authenticateUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('Email', sql.VarChar(100), email)
      .input('Clave', sql.VarChar(255), password)
      .execute('sp_AutenticarUsuario');

    if (result.recordset[0].Resultado === 'Error') {
      return res.status(401).json(result.recordset[0]);
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error en autenticación',
      error: error.message 
    });
  }
};

// Actualizar perfil de usuario
export const updateUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { NombreUsuario, FotoPerfil, ClaveActual, NuevaClave } = req.body;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('NombreUsuario', sql.VarChar(100), NombreUsuario)
      .input('FotoPerfil', sql.VarChar(255), FotoPerfil)
      .input('ClaveActual', sql.VarChar(255), ClaveActual)
      .input('NuevaClave', sql.VarChar(255), NuevaClave)
      .execute('sp_ActualizarPerfil');

    res.json({
      message: 'Usuario actualizado correctamente',
      usuario: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input('IdUsuario', idUsuario)
      .execute('DELETE_Usuario');
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
