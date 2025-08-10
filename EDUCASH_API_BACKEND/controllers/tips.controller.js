import { getConnection } from '../database/connection.js';

export const getTips = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .execute('GET_ObtenerTips');
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      details: error.stack 
    });
  }
};

export const getTipById = async (req, res) => {
  try {
    const { idTip } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('IdTip', idTip)
      .execute('GET_ObtenerDetalleTip');
    
    // Organizar los resultados como un objeto con secciones
    const response = {
      infoBasica: result.recordsets[0][0],
      ejemplos: result.recordsets[1],
      secciones: result.recordsets[2],
      items: result.recordsets[3],
      recursos: result.recordsets[4]
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      details: error.stack 
    });
  }
};