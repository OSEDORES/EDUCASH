import { getConnection } from '../database/connection.js';

// Obtener todos los recordatorios
export const getRecordatorios = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GET_Recordatorios');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener recordatorio por ID
export const getRecordatorioById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdRecordatorio', id)
      .execute('GET_RecordatorioById');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nuevo recordatorio
export const createRecordatorio = async (req, res) => {
  try {
    const { IdUsuario, Titulo, Descripcion, FechaRecordatorio, Activo } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdUsuario', IdUsuario)
      .input('Titulo', Titulo)
      .input('Descripcion', Descripcion)
      .input('FechaRecordatorio', FechaRecordatorio)
      .input('Activo', Activo)
      .execute('POST_Recordatorio');
    res.status(201).json({ message: 'Recordatorio creado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar recordatorio
export const updateRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const { Titulo, Descripcion, FechaRecordatorio, Activo } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdRecordatorio', id)
      .input('Titulo', Titulo)
      .input('Descripcion', Descripcion)
      .input('FechaRecordatorio', FechaRecordatorio)
      .input('Activo', Activo)
      .execute('PUT_Recordatorio');
    res.json({ message: 'Recordatorio actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar recordatorio
export const deleteRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input('IdRecordatorio', id)
      .execute('DELETE_Recordatorio');
    res.json({ message: 'Recordatorio eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
