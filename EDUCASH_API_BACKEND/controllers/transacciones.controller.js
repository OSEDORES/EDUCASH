import { getConnection } from '../database/connection.js';

// Obtener todos los ingresos usando procedimiento almacenado
export const getIngresos = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdUsuario', idUsuario)
      .execute('GET_IngresosUsuario');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los gastos usando procedimiento almacenado
export const getGastos = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdUsuario', idUsuario)
      .execute('GET_GastosPorUsuario');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Registrar un nuevo ingreso
export const createIngreso = async (req, res) => {
  try {
    const { IdUsuario, IdCategoriaIngreso, Monto, Fecha, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdUsuario', IdUsuario)
      .input('IdCategoriaIngreso', IdCategoriaIngreso)
      .input('Monto', Monto)
      .input('Fecha', Fecha)
      .input('Descripcion', Descripcion)
      .execute('POST_RegistrarIngreso');
    res.status(201).json({ message: 'Ingreso registrado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar un nuevo gasto
export const createGasto = async (req, res) => {
  try {
    const { IdUsuario, IdCategoriaGasto, Monto, Fecha, Descripcion } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input('IdUsuario', IdUsuario)
      .input('IdCategoriaGasto', IdCategoriaGasto)
      .input('Monto', Monto)
      .input('Fecha', Fecha)
      .input('Descripcion', Descripcion)
      .execute('POST_RegistrarGasto');
    res.status(201).json({ message: 'Gasto registrado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar ingreso
export const updateIngreso = async (req, res) => {
  try {
    const { idIngreso } = req.params;
    const { IdCategoriaIngreso, Monto, Fecha, Descripcion } = req.body;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdIngreso', idIngreso)
      .input('IdCategoriaIngreso', IdCategoriaIngreso)
      .input('Monto', Monto)
      .input('Fecha', Fecha)
      .input('Descripcion', Descripcion)
      .execute('PUT_Ingreso');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar ingreso
export const deleteIngreso = async (req, res) => {
  try {
    const { idIngreso } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdIngreso', idIngreso)
      .execute('DELETE_Ingreso');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar gasto
export const updateGasto = async (req, res) => {
  try {
    const { idGasto } = req.params;
    const { IdCategoriaGasto, Monto, Fecha, Descripcion } = req.body;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdGasto', idGasto)
      .input('IdCategoriaGasto', IdCategoriaGasto)
      .input('Monto', Monto)
      .input('Fecha', Fecha)
      .input('Descripcion', Descripcion)
      .execute('PUT_Gasto');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar gasto
export const deleteGasto = async (req, res) => {
  try {
    const { idGasto } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdGasto', idGasto)
      .execute('DELETE_Gasto');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};