import { getConnection, sql } from '../database/connection.js';

// Obtener todos los presupuestos de un usuario
export const getPresupuestos = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdUsuario', idUsuario)
      .execute('GET_PresupuestosUsuario');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los ingresos de un usuario
export const getIngresosPorUsuario = async (req, res) => {
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

// Obtener todos los gastos de un usuario
export const getGastosPorUsuario = async (req, res) => {
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
};

// Obtener categorías de ingresos
export const getCategoriasIngresos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GET_CategoriasIngresos');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo presupuesto
export const createPresupuesto = async (req, res) => {
    try {
        const { IdUsuario, NombrePresupuesto, IdTipoPresupuesto, IdPeriodo, MontoTotal, Objetivo, DetallesPresupuesto } = req.body;
        const pool = await getConnection();
        
        // Creamos la tabla temporal para los detalles
        const detallesTable = new sql.Table();
        detallesTable.columns.add('Id_Categoria', sql.Int);
        detallesTable.columns.add('Monto_Asignado', sql.Decimal(10, 2));
        
        // Llenamos la tabla con los datos
        DetallesPresupuesto.forEach(detalle => {
            detallesTable.rows.add(detalle.Id_Categoria, detalle.Monto_Asignado);
        });

        const result = await pool.request()
            .input('IdUsuario', sql.Int, IdUsuario)
            .input('NombrePresupuesto', sql.NVarChar(100), NombrePresupuesto)
            .input('IdTipoPresupuesto', sql.Int, IdTipoPresupuesto)
            .input('IdPeriodo', sql.Int, IdPeriodo)
            .input('MontoTotal', sql.Decimal(10, 2), MontoTotal)
            .input('Objetivo', sql.NVarChar(255), Objetivo)
            .input('DetallesPresupuesto', detallesTable)
            .execute('POST_CrearPresupuesto');

        res.status(201).json({
            message: 'Presupuesto creado correctamente',
            idPresupuesto: result.recordset[0].Id_Presupuesto
        });

    } catch (error) {
        console.error('Error al crear presupuesto:', error);
        res.status(500).json({
            message: 'Error al crear presupuesto',
            error: error.message
        });
    }
};

// Actualizar un presupuesto
export const updatePresupuesto = async (req, res) => {
  try {
    const { idPresupuesto } = req.params;
    const { NombrePresupuesto, IdPeriodo, MontoTotal, Objetivo, DetallesPresupuesto } = req.body;
    const pool = await getConnection();

    // Crear tabla temporal para los detalles si se proporcionan
    let detallesTable = null;
    if (DetallesPresupuesto && DetallesPresupuesto.length > 0) {
      detallesTable = new sql.Table();
      detallesTable.columns.add('Id_Categoria', sql.Int);
      detallesTable.columns.add('Monto_Asignado', sql.Decimal(10, 2));

      DetallesPresupuesto.forEach(detalle => {
        detallesTable.rows.add(detalle.Id_Categoria, detalle.Monto_Asignado);
      });
    }

    const request = pool.request()
      .input('IdPresupuesto', sql.Int, idPresupuesto);

    // Agregar inputs solo si se proporcionan
    if (NombrePresupuesto !== undefined) {
      request.input('NombrePresupuesto', sql.NVarChar(100), NombrePresupuesto);
    }
    if (IdPeriodo !== undefined) {
      request.input('IdPeriodo', sql.Int, IdPeriodo);
    }
    if (MontoTotal !== undefined) {
      request.input('MontoTotal', sql.Decimal(10, 2), MontoTotal);
    }
    if (Objetivo !== undefined) {
      request.input('Objetivo', sql.NVarChar(255), Objetivo);
    }
    if (detallesTable) {
      request.input('DetallesPresupuesto', detallesTable);
    }

    const result = await request.execute('sp_ActualizarPresupuesto');

    res.json({
      message: 'Presupuesto actualizado correctamente',
      presupuesto: result.recordset[0]
    });

  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    res.status(500).json({
      message: 'Error al actualizar presupuesto',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Eliminar un presupuesto
export const deletePresupuesto = async (req, res) => {
  try {
    const { idPresupuesto } = req.params;
    const pool = await getConnection();
    await pool.request()
      .input('IdPresupuesto', idPresupuesto)
      .execute('DELETE_Presupuesto');
    res.json({ message: 'Presupuesto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
