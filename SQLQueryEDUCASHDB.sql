-- Tabla Usuarios
CREATE TABLE Usuarios (
    Id_Usuario INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Clave VARCHAR(255) NOT NULL,
    Nombre_Usuario VARCHAR(100) NOT NULL,
    Foto_Perfil VARCHAR(255),
    Fecha_Registro DATETIME,
    Ultimo_Login DATETIME,
    Id_Estado INT NOT NULL
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Tabla Estados
CREATE TABLE Estados (
    Id_Estado INT IDENTITY(1,1) PRIMARY KEY,
    Estado VARCHAR(20) NOT NULL
);

INSERT INTO Estados (Estado) VALUES 
('Activo'), ('Inactivo'), ('Suspendido'), ('Eliminado');

-- Tabla Categorías de Ingresos
CREATE TABLE Categorias_Ingresos (
    Id_Categoria_Ingreso INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Categoria_Ingreso VARCHAR(50) UNIQUE NOT NULL,
    Icono VARCHAR(50) NOT NULL,
    Color VARCHAR(20) NOT NULL,
    Descripcion VARCHAR(255),
    Meta_Mensual DECIMAL(10,2) DEFAULT 0,
);

-- Tabla Categorías_Gastos
CREATE TABLE Categorias_Gastos (
    Id_Categoria_Gasto INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_Categoria_Gasto VARCHAR(50) UNIQUE NOT NULL,
    Icono VARCHAR(50) NOT NULL,
    Color VARCHAR(20) NOT NULL,
    Descripcion VARCHAR(255),
    Presupuesto_Mensual DECIMAL(10,2) DEFAULT 0,
    Id_Prioridad INT NOT NULL
    FOREIGN KEY (Id_Prioridad) REFERENCES Prioridades_Gastos(Id_Prioridad)
);

-- Tabla de Prioridades de Gastos
CREATE TABLE Prioridades_Gastos (
    Id_Prioridad INT IDENTITY(1,1) PRIMARY KEY,
    Prioridad VARCHAR(20) NOT NULL
);

INSERT INTO Prioridades_Gastos (Prioridad) VALUES 
('Alta'), ('Media'), ('Baja');

-- Tabla Ingresos
CREATE TABLE Ingresos (
    Id_Ingreso INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Categoria_Ingreso INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    Fecha DATETIME NOT NULL,
    Descripcion VARCHAR(255),
    FOREIGN KEY (Id_Usuario) REFERENCES Usuarios(Id_Usuario),
    FOREIGN KEY (Id_Categoria_Ingreso) REFERENCES Categorias_Ingresos(Id_Categoria_Ingreso),
    INDEX idx_usuario_fecha (Id_Usuario, Fecha)
);

-- Tabla Gastos
CREATE TABLE Gastos (
    Id_Gasto INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Categoria_Gasto INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    Fecha DATETIME NOT NULL,
    Descripcion VARCHAR(255),
    FOREIGN KEY (Id_Usuario) REFERENCES Usuarios(Id_Usuario),
    FOREIGN KEY (Id_Categoria_Gasto) REFERENCES Categorias_Gastos(Id_Categoria_Gasto),
    INDEX idx_usuario_fecha (Id_Usuario, Fecha)
);

-- Tabla Tipos de Presupuesto
CREATE TABLE Tipos_Presupuesto (
    Id_Tipo_Presupuesto INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Presupuesto VARCHAR(20) NOT NULL
);

-- Insertar valores básicos para tipos de presupuesto
INSERT INTO Tipos_Presupuesto (Tipo_Presupuesto) VALUES 
('Gasto'), ('Ingreso'), ('Ahorro');

-- Tabla Periodos_Presupuesto
CREATE TABLE Periodos_Presupuesto (
    Id_Periodo INT IDENTITY(1,1) PRIMARY KEY,
    Periodo VARCHAR(20) NOT NULL
);

-- Insertar valores básicos para periodos
INSERT INTO Periodos_Presupuesto (Periodo) VALUES 
('Diario'), ('Semanal'), ('Mensual'), ('Trimestral'), ('Anual');

-- Tabla Presupuestos
CREATE TABLE Presupuestos (
    Id_Presupuesto INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Nombre_Presupuesto VARCHAR(100) NOT NULL,
    Id_Tipo_Presupuesto INT NOT NULL,
    Id_Periodo INT NOT NULL,
    Monto_Total DECIMAL(10,2) NOT NULL,
    Monto_Usado DECIMAL(10,2) DEFAULT 0,
    Objetivo VARCHAR(255),
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
    Id_Estado INT NOT NULL,
    FOREIGN KEY (Id_Usuario) REFERENCES Usuarios(Id_Usuario),
    FOREIGN KEY (Id_Tipo_Presupuesto) REFERENCES Tipos_Presupuesto(Id_Tipo_Presupuesto),
    FOREIGN KEY (Id_Periodo) REFERENCES Periodos_Presupuesto(Id_Periodo),
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Tabla Detalles del Presupuesto
CREATE TABLE Detalles_Presupuesto (
    Id_Detalle_Presupuesto INT IDENTITY(1,1) PRIMARY KEY,
    Id_Presupuesto INT NOT NULL,
    Id_Categoria_Ingreso INT NULL,
    Id_Categoria_Gasto INT NULL,
    Monto_Asignado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Id_Presupuesto) REFERENCES Presupuestos(Id_Presupuesto),
    FOREIGN KEY (Id_Categoria_Ingreso) REFERENCES Categorias_Ingresos(Id_Categoria_Ingreso),
    FOREIGN KEY (Id_Categoria_Gasto) REFERENCES Categorias_Gastos(Id_Categoria_Gasto),
    CONSTRAINT CK_Categoria_Check CHECK (
        (Id_Categoria_Ingreso IS NOT NULL AND Id_Categoria_Gasto IS NULL) OR
        (Id_Categoria_Ingreso IS NULL AND Id_Categoria_Gasto IS NOT NULL)
    )
);

-- Tabla Impactos para Tabla Tips 
CREATE TABLE Impactos_Tips (
    Id_Impacto INT IDENTITY(1,1) PRIMARY KEY,
    Impacto VARCHAR(20) NOT NULL
);

-- Insertar valores básicos para impactos
INSERT INTO Impactos_Tips (Impacto) VALUES 
('Alto'), ('Medio'), ('Bajo');

-- Tabla Flexibilidades para Tips
CREATE TABLE Flexibilidades_Tips (
    Id_Flexibilidad INT IDENTITY(1,1) PRIMARY KEY,
    Flexibilidad VARCHAR(20) NOT NULL
);

-- Insertar valores básicos para flexibilidades
INSERT INTO Flexibilidades_Tips (Flexibilidad) VALUES 
('Alta'), ('Media'), ('Baja');

-- Tabla Tips_Financieros (reestructurada)
CREATE TABLE Tips_Financieros (
    Id_Tip INT IDENTITY(1,1) PRIMARY KEY,
    Titulo VARCHAR(100) NOT NULL,
    Icono VARCHAR(50) NOT NULL,
    Definicion VARCHAR(500) NOT NULL,
    Porcentaje_Ingresos INT NOT NULL,
    Id_Impacto INT NOT NULL,
    Id_Flexibilidad INT NOT NULL,
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
    Id_Estado INT NOT NULL,
    FOREIGN KEY (Id_Impacto) REFERENCES Impactos_Tips(Id_Impacto),
    FOREIGN KEY (Id_Flexibilidad) REFERENCES Flexibilidades_Tips(Id_Flexibilidad),
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Tabla Ejemplos_Tips
CREATE TABLE Ejemplos_Tips (
    Id_Ejemplo INT IDENTITY(1,1) PRIMARY KEY,
    Id_Tip INT NOT NULL,
    Nombre_Ejemplo VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500) NOT NULL,
    Consejo VARCHAR(500) NOT NULL,
    FOREIGN KEY (Id_Tip) REFERENCES Tips_Financieros(Id_Tip) ON DELETE CASCADE
);

-- Tabla Secciones_Tips
CREATE TABLE Secciones_Tips (
    Id_Seccion INT IDENTITY(1,1) PRIMARY KEY,
    Id_Tip INT NOT NULL,
    Titulo_Seccion VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500),
    Estadistica VARCHAR(255),
    Orden INT NOT NULL,
    FOREIGN KEY (Id_Tip) REFERENCES Tips_Financieros(Id_Tip) ON DELETE CASCADE
);

-- Tabla Items_Seccion (reestructurada)
CREATE TABLE Items_Seccion (
    Id_Item INT IDENTITY(1,1) PRIMARY KEY,
    Id_Seccion INT NOT NULL,
    Item VARCHAR(500) NOT NULL,
    Orden INT NOT NULL,
    FOREIGN KEY (Id_Seccion) REFERENCES Secciones_Tips(Id_Seccion) ON DELETE CASCADE
);

-- Tabla Tipos de Recurso
CREATE TABLE Tipos_Recurso (
    Id_Tipo_Recurso INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Recurso VARCHAR(50) NOT NULL
);

-- Insertar valores básicos para tipos de recurso
INSERT INTO Tipos_Recurso (Tipo_Recurso) VALUES 
('Enlace'), ('Documento'), ('Video'), ('Herramienta');

-- Tabla Recursos_Tips
CREATE TABLE Recursos_Tips (
    Id_Recurso INT IDENTITY(1,1) PRIMARY KEY,
    Id_Tip INT NOT NULL,
    Id_Tipo_Recurso INT NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Url VARCHAR(255) NOT NULL,
    Descripcion VARCHAR(255),
    FOREIGN KEY (Id_Tip) REFERENCES Tips_Financieros(Id_Tip) ON DELETE CASCADE,
    FOREIGN KEY (Id_Tipo_Recurso) REFERENCES Tipos_Recurso(Id_Tipo_Recurso)
);

-- Tabla Tipos_Recordatorio
CREATE TABLE Tipos_Recordatorio (
    Id_Tipo_Recordatorio INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Recordatorio VARCHAR(50) NOT NULL
);

-- Insertar valores básicos para tipos de recordatorio
INSERT INTO Tipos_Recordatorio (Tipo_Recordatorio) VALUES 
('Pago'), ('Presupuesto'), ('Meta'), ('General');

-- Tabla Recordatorios
CREATE TABLE Recordatorios (
    Id_Recordatorio INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Tipo_Recordatorio INT NOT NULL,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255),
    Fecha_Recordatorio DATETIME NOT NULL,
    Repetir BIT DEFAULT 0,
    Frecuencia VARCHAR(50),
    Id_Estado INT NOT NULL,
    FOREIGN KEY (Id_Usuario) REFERENCES Usuarios(Id_Usuario),
    FOREIGN KEY (Id_Tipo_Recordatorio) REFERENCES Tipos_Recordatorio(Id_Tipo_Recordatorio),
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Tabla Metas_Ahorro
CREATE TABLE Metas_Ahorro (
    Id_Meta_Ahorro INT IDENTITY(1,1) PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Nombre_Meta VARCHAR(100) NOT NULL,
    Monto_Objetivo DECIMAL(10,2) NOT NULL,
    Monto_Acumulado DECIMAL(10,2) DEFAULT 0,
    Fecha_Objetivo DATE,
    Descripcion VARCHAR(255),
    Id_Estado INT NOT NULL,
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (Id_Usuario) REFERENCES Usuarios(Id_Usuario),
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Tabla Transacciones_Ahorro
CREATE TABLE Transacciones_Ahorro (
    Id_Transaccion_Ahorro INT IDENTITY(1,1) PRIMARY KEY,
    Id_Meta_Ahorro INT NOT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    Descripcion VARCHAR(255),
    Id_Estado INT NOT NULL,
    FOREIGN KEY (Id_Meta_Ahorro) REFERENCES Metas_Ahorro(Id_Meta_Ahorro),
    FOREIGN KEY (Id_Estado) REFERENCES Estados(Id_Estado)
);

-- Crear un tipo de tabla para los detalles de presupuesto
CREATE TYPE DetallePresupuestoType AS TABLE (
    Id_Categoria INT NOT NULL,
    Monto_Asignado DECIMAL(10,2) NOT NULL
);
GO

--Procedimientos para gestión de usuarios

-- 1. Registrar nuevo usuario
CREATE PROCEDURE POST_RegistrarUsuario
    @Email VARCHAR(100),
    @Clave VARCHAR(255),
    @NombreUsuario VARCHAR(100),
    @FotoPerfil VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si el email ya existe
        IF EXISTS (SELECT 1 FROM Usuarios WHERE Email = @Email)
        BEGIN
            SELECT 'Error' AS Resultado, 'El correo electrónico ya está registrado' AS Mensaje;
            RETURN;
        END
        
        -- Insertar nuevo usuario
        INSERT INTO Usuarios (Email, Clave, Nombre_Usuario, Foto_Perfil, Fecha_Registro, Id_Estado)
        VALUES (@Email, @Clave, @NombreUsuario, @FotoPerfil, GETDATE(), 1); -- 1 = Activo
        
        SELECT 'Éxito' AS Resultado, 'Usuario registrado correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Usuario;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

-- 2. Autenticar usuario
CREATE PROCEDURE sp_AutenticarUsuario
    @Email VARCHAR(100),
    @Clave VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @IdUsuario INT;
    DECLARE @ClaveDB VARCHAR(255);
    DECLARE @Estado INT;
    
    SELECT 
        @IdUsuario = Id_Usuario,
        @ClaveDB = Clave,
        @Estado = Id_Estado
    FROM Usuarios
    WHERE Email = @Email;
    
    -- Verificar si el usuario existe
    IF @IdUsuario IS NULL
    BEGIN
        SELECT 'Error' AS Resultado, 'Usuario no encontrado' AS Mensaje;
        RETURN;
    END
    
    -- Verificar estado del usuario
    IF @Estado <> 1 -- 1 = Activo
    BEGIN
        SELECT 'Error' AS Resultado, 
               CASE @Estado
                   WHEN 2 THEN 'Usuario inactivo'
                   WHEN 3 THEN 'Usuario suspendido'
                   WHEN 4 THEN 'Usuario eliminado'
                   ELSE 'Usuario no disponible'
               END AS Mensaje;
        RETURN;
    END
    
    -- Verificar contraseña (en producción usaría BCrypt)
    IF @ClaveDB <> @Clave
    BEGIN
        SELECT 'Error' AS Resultado, 'Credenciales incorrectas' AS Mensaje;
        RETURN;
    END
    
    -- Actualizar último login
    UPDATE Usuarios
    SET Ultimo_Login = GETDATE()
    WHERE Id_Usuario = @IdUsuario;
    
    -- Devolver datos del usuario
    SELECT 
        'Éxito' AS Resultado,
        'Autenticación exitosa' AS Mensaje,
        Id_Usuario,
        Email,
        Nombre_Usuario,
        Foto_Perfil
    FROM Usuarios
    WHERE Id_Usuario = @IdUsuario;
END;
GO

-- 3. Actualizar perfil de usuario
CREATE PROCEDURE sp_ActualizarPerfil
    @IdUsuario INT,
    @NombreUsuario VARCHAR(100) = NULL,
    @FotoPerfil VARCHAR(255) = NULL,
    @ClaveActual VARCHAR(255) = NULL,
    @NuevaClave VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si el usuario existe
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
        BEGIN
            SELECT 'Error' AS Resultado, 'Usuario no encontrado o inactivo' AS Mensaje;
            RETURN;
        END
        
        -- Actualizar nombre si se proporciona
        IF @NombreUsuario IS NOT NULL
        BEGIN
            UPDATE Usuarios
            SET Nombre_Usuario = @NombreUsuario
            WHERE Id_Usuario = @IdUsuario;
        END
        
        -- Actualizar foto de perfil si se proporciona
        IF @FotoPerfil IS NOT NULL
        BEGIN
            UPDATE Usuarios
            SET Foto_Perfil = @FotoPerfil
            WHERE Id_Usuario = @IdUsuario;
        END
        
        -- Cambiar contraseña si se proporcionan ambas
        IF @ClaveActual IS NOT NULL AND @NuevaClave IS NOT NULL
        BEGIN
            DECLARE @ClaveDB VARCHAR(255);
            
            SELECT @ClaveDB = Clave
            FROM Usuarios
            WHERE Id_Usuario = @IdUsuario;
            
            -- Verificar contraseña actual
            IF @ClaveDB <> @ClaveActual
            BEGIN
                SELECT 'Error' AS Resultado, 'La contraseña actual no es correcta' AS Mensaje;
                RETURN;
            END
            
            -- Actualizar contraseña
            UPDATE Usuarios
            SET Clave = @NuevaClave
            WHERE Id_Usuario = @IdUsuario;
        END
        
        SELECT 'Éxito' AS Resultado, 'Perfil actualizado correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--Procedimientos para gestionar transacciones
-- 4. Registrar un nuevo ingreso
CREATE PROCEDURE POST_RegistrarIngreso
    @IdUsuario INT,
    @IdCategoriaIngreso INT,
    @Monto DECIMAL(10,2),
    @Fecha DATETIME = NULL,
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar usuario y categoría
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
        BEGIN
            SELECT 'Error' AS Resultado, 'Usuario no válido' AS Mensaje;
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM Categorias_Ingresos WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso)
        BEGIN
            SELECT 'Error' AS Resultado, 'Categoría no válida' AS Mensaje;
            RETURN;
        END
        
        -- Establecer fecha actual si no se proporciona
        IF @Fecha IS NULL
            SET @Fecha = GETDATE();
        
        -- Insertar el ingreso
        INSERT INTO Ingresos (Id_Usuario, Id_Categoria_Ingreso, Monto, Fecha, Descripcion)
        VALUES (@IdUsuario, @IdCategoriaIngreso, @Monto, @Fecha, @Descripcion);
        
        -- Obtener el ID del ingreso recién insertado
        DECLARE @IdIngreso INT = SCOPE_IDENTITY();
        
        -- Actualizar presupuestos relacionados
        UPDATE p
        SET p.Monto_Usado = p.Monto_Usado + @Monto
        FROM Presupuestos p
        INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
        WHERE p.Id_Usuario = @IdUsuario
        AND p.Id_Estado = 1
        AND dp.Id_Categoria_Ingreso = @IdCategoriaIngreso;
        
        SELECT 'Éxito' AS Resultado, 'Ingreso registrado correctamente' AS Mensaje, @IdIngreso AS Id_Ingreso;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;  -- Asegúrate de hacer rollback si hay un error
        SELECT 
            'Error' AS Resultado, 
            ERROR_MESSAGE() AS Mensaje,
            ERROR_NUMBER() AS NumeroError,
            @@TRANCOUNT AS EstadoTransaccion;
    END CATCH
END;
GO

-- 5. Registrar un nuevo gasto
CREATE PROCEDURE POST_RegistrarGasto
    @IdUsuario INT,
    @IdCategoriaGasto INT,
    @Monto DECIMAL(10,2),
    @Fecha DATETIME = NULL,
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION; -- Asegurar que no haya transacciones abiertas al inicio

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar usuario y categoría
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Usuario no válido', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Categorias_Gastos WHERE Id_Categoria_Gasto = @IdCategoriaGasto)
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Categoría no válida', 16, 1);
            RETURN;
        END

        -- Establecer fecha actual si no se proporciona
        IF @Fecha IS NULL
            SET @Fecha = GETDATE();

        -- Insertar el gasto
        INSERT INTO Gastos (Id_Usuario, Id_Categoria_Gasto, Monto, Fecha, Descripcion)
        VALUES (@IdUsuario, @IdCategoriaGasto, @Monto, @Fecha, @Descripcion);

        -- Obtener el ID del gasto recién insertado
        DECLARE @IdGasto INT = SCOPE_IDENTITY();

        -- Actualizar presupuestos relacionados
        UPDATE p
        SET p.Monto_Usado = p.Monto_Usado + @Monto
        FROM Presupuestos p
        INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
        WHERE p.Id_Usuario = @IdUsuario
        AND p.Id_Estado = 1
        AND dp.Id_Categoria_Gasto = @IdCategoriaGasto;

        -- Verificar si se excede el presupuesto de categoría
        DECLARE @PresupuestoMensual DECIMAL(10,2);
        DECLARE @TotalGastado DECIMAL(10,2);

        SELECT @PresupuestoMensual = Presupuesto_Mensual
        FROM Categorias_Gastos
        WHERE Id_Categoria_Gasto = @IdCategoriaGasto;

        IF @PresupuestoMensual > 0
        BEGIN
            SELECT @TotalGastado = SUM(Monto)
            FROM Gastos
            WHERE Id_Usuario = @IdUsuario
            AND Id_Categoria_Gasto = @IdCategoriaGasto
            AND MONTH(Fecha) = MONTH(@Fecha)
            AND YEAR(Fecha) = YEAR(@Fecha);

            IF @TotalGastado > @PresupuestoMensual
            BEGIN
                ROLLBACK TRANSACTION;
                RAISERROR('Has excedido el presupuesto mensual para esta categoría', 16, 1);
                RETURN;
            END
        END

        COMMIT TRANSACTION;

        SELECT 'Éxito' AS Resultado, 'Gasto registrado correctamente' AS Mensaje, @IdGasto AS Id_Gasto;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

-- 6. Obtener resumen financiero mensual
CREATE PROCEDURE GET_ObtenerResumenMensual
    @IdUsuario INT,
    @Mes INT,
    @Anio INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar usuario válido
    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
    BEGIN
        SELECT 'Error' AS Resultado, 'Usuario no válido' AS Mensaje;
        RETURN;
    END
    
    -- Totales generales
    SELECT 
        COALESCE(SUM(CASE WHEN i.Id_Ingreso IS NOT NULL THEN i.Monto ELSE 0 END), 0) AS Total_Ingresos,
        COALESCE(SUM(CASE WHEN g.Id_Gasto IS NOT NULL THEN g.Monto ELSE 0 END), 0) AS Total_Gastos,
        COALESCE(SUM(CASE WHEN i.Id_Ingreso IS NOT NULL THEN i.Monto ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN g.Id_Gasto IS NOT NULL THEN g.Monto ELSE 0 END), 0) AS Balance,
        
        -- Porcentaje de ahorro (asumiendo meta del 20%)
        CASE 
            WHEN COALESCE(SUM(CASE WHEN i.Id_Ingreso IS NOT NULL THEN i.Monto ELSE 0 END), 0) > 0 THEN
                (COALESCE(SUM(CASE WHEN i.Id_Ingreso IS NOT NULL THEN i.Monto ELSE 0 END), 0) - 
                 COALESCE(SUM(CASE WHEN g.Id_Gasto IS NOT NULL THEN g.Monto ELSE 0 END), 0)) / 
                COALESCE(SUM(CASE WHEN i.Id_Ingreso IS NOT NULL THEN i.Monto ELSE 0 END), 0) * 100
            ELSE 0
        END AS Porcentaje_Ahorro
    FROM Usuarios u
    LEFT JOIN Ingresos i ON u.Id_Usuario = i.Id_Usuario 
                        AND MONTH(i.Fecha) = @Mes 
                        AND YEAR(i.Fecha) = @Anio
    LEFT JOIN Gastos g ON u.Id_Usuario = g.Id_Usuario 
                       AND MONTH(g.Fecha) = @Mes 
                       AND YEAR(g.Fecha) = @Anio
    WHERE u.Id_Usuario = @IdUsuario;
    
    -- Ingresos por categoría
    SELECT 
        ci.Nombre_Categoria_Ingreso AS Categoria,
        ci.Icono,
        ci.Color,
        SUM(i.Monto) AS Total,
        COUNT(i.Id_Ingreso) AS Cantidad
    FROM Ingresos i
    INNER JOIN Categorias_Ingresos ci ON i.Id_Categoria_Ingreso = ci.Id_Categoria_Ingreso
    WHERE i.Id_Usuario = @IdUsuario 
    AND MONTH(i.Fecha) = @Mes 
    AND YEAR(i.Fecha) = @Anio
    GROUP BY ci.Nombre_Categoria_Ingreso, ci.Icono, ci.Color
    ORDER BY Total DESC;
    
    -- Gastos por categoría
    SELECT 
        cg.Nombre_Categoria_Gasto AS Categoria,
        cg.Icono,
        cg.Color,
        pg.Prioridad,
        SUM(g.Monto) AS Total,
        COUNT(g.Id_Gasto) AS Cantidad,
        cg.Presupuesto_Mensual,
        CASE 
            WHEN cg.Presupuesto_Mensual > 0 THEN 
                (SUM(g.Monto) / cg.Presupuesto_Mensual * 100)
            ELSE NULL
        END AS Porcentaje_Presupuesto
    FROM Gastos g
    INNER JOIN Categorias_Gastos cg ON g.Id_Categoria_Gasto = cg.Id_Categoria_Gasto
    INNER JOIN Prioridades_Gastos pg ON cg.Id_Prioridad = pg.Id_Prioridad
    WHERE g.Id_Usuario = @IdUsuario 
    AND MONTH(g.Fecha) = @Mes 
    AND YEAR(g.Fecha) = @Anio
    GROUP BY cg.Nombre_Categoria_Gasto, cg.Icono, cg.Color, pg.Prioridad, cg.Presupuesto_Mensual
    ORDER BY Total DESC;
    
    -- Estado de presupuestos
    SELECT 
        p.Nombre_Presupuesto,
        tp.Tipo_Presupuesto,
        pp.Periodo,
        p.Monto_Total,
        p.Monto_Usado,
        (p.Monto_Usado / p.Monto_Total * 100) AS Porcentaje_Usado,
        CASE 
            WHEN p.Monto_Usado > p.Monto_Total THEN 'Excedido'
            WHEN p.Monto_Usado / p.Monto_Total >= 0.8 THEN 'Cerca del límite'
            ELSE 'Dentro del límite'
        END AS Estado
    FROM Presupuestos p
    INNER JOIN Tipos_Presupuesto tp ON p.Id_Tipo_Presupuesto = tp.Id_Tipo_Presupuesto
    INNER JOIN Periodos_Presupuesto pp ON p.Id_Periodo = pp.Id_Periodo
    WHERE p.Id_Usuario = @IdUsuario
    AND p.Id_Estado = 1 -- Activo
    ORDER BY Estado, Porcentaje_Usado DESC;
END;
GO


--Procedimientos para gestionar presupuestos
-- 7. Crear nuevo presupuesto
CREATE PROCEDURE POST_CrearPresupuesto
    @IdUsuario INT,
    @NombrePresupuesto VARCHAR(100),
    @IdTipoPresupuesto INT,
    @IdPeriodo INT,
    @MontoTotal DECIMAL(10,2),
    @Objetivo VARCHAR(255) = NULL,
    @DetallesPresupuesto DetallePresupuestoType READONLY
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar tipo de presupuesto
        IF @IdTipoPresupuesto NOT IN (1, 2, 3)
        BEGIN
            RAISERROR('Tipo de presupuesto no válido. Use 1 (Gasto), 2 (Ingreso) o 3 (Ahorro)', 16, 1);
            RETURN;
        END
        
        -- Insertar el presupuesto principal
        DECLARE @IdPresupuesto INT;
        
        INSERT INTO Presupuestos (
            Id_Usuario, 
            Nombre_Presupuesto, 
            Id_Tipo_Presupuesto, 
            Id_Periodo, 
            Monto_Total,
            Objetivo,
            Id_Estado
        )
        VALUES (
            @IdUsuario,
            @NombrePresupuesto,
            @IdTipoPresupuesto,
            @IdPeriodo,
            @MontoTotal,
            @Objetivo,
            1 -- Activo
        );
        
        SET @IdPresupuesto = SCOPE_IDENTITY();
        
        -- Insertar detalles según el tipo de presupuesto
        IF @IdTipoPresupuesto = 2 -- Ingreso
        BEGIN
            INSERT INTO Detalles_Presupuesto (
                Id_Presupuesto,
                Id_Categoria_Ingreso,
                Id_Categoria_Gasto,
                Monto_Asignado
            )
            SELECT 
                @IdPresupuesto,
                Id_Categoria, -- Usamos Id_Categoria como Id_Categoria_Ingreso
                NULL,
                Monto_Asignado
            FROM @DetallesPresupuesto;
        END
        ELSE -- Gasto (1) o Ahorro (3)
        BEGIN
            INSERT INTO Detalles_Presupuesto (
                Id_Presupuesto,
                Id_Categoria_Ingreso,
                Id_Categoria_Gasto,
                Monto_Asignado
            )
            SELECT 
                @IdPresupuesto,
                NULL,
                Id_Categoria, -- Usamos Id_Categoria como Id_Categoria_Gasto
                Monto_Asignado
            FROM @DetallesPresupuesto;
        END
        
        COMMIT TRANSACTION;
        
        SELECT 'Éxito' AS Resultado, 'Presupuesto creado correctamente' AS Mensaje, @IdPresupuesto AS Id_Presupuesto;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SELECT 'Error' AS Resultado, 
               ERROR_MESSAGE() AS Mensaje;
    END CATCH
END
GO

-- 8. Actualizar presupuesto
CREATE PROCEDURE sp_ActualizarPresupuesto
    @IdPresupuesto INT,
    @NombrePresupuesto VARCHAR(100) = NULL,
    @IdPeriodo INT = NULL,
    @MontoTotal DECIMAL(10,2) = NULL,
    @Objetivo VARCHAR(255) = NULL,
    @IdEstado INT = NULL,
    @DetallesPresupuesto DetallePresupuestoType READONLY
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si el presupuesto existe
        IF NOT EXISTS (SELECT 1 FROM Presupuestos WHERE Id_Presupuesto = @IdPresupuesto)
        BEGIN
            SELECT 'Error' AS Resultado, 'Presupuesto no encontrado' AS Mensaje;
            RETURN;
        END
        
        -- Obtener el tipo de presupuesto
        DECLARE @IdTipoPresupuesto INT;
        SELECT @IdTipoPresupuesto = Id_Tipo_Presupuesto FROM Presupuestos WHERE Id_Presupuesto = @IdPresupuesto;
        
        -- Actualizar campos básicos si se proporcionan
        IF @NombrePresupuesto IS NOT NULL
        BEGIN
            UPDATE Presupuestos
            SET Nombre_Presupuesto = @NombrePresupuesto
            WHERE Id_Presupuesto = @IdPresupuesto;
        END
        
        IF @IdPeriodo IS NOT NULL
        BEGIN
            -- Validar periodo
            IF NOT EXISTS (SELECT 1 FROM Periodos_Presupuesto WHERE Id_Periodo = @IdPeriodo)
            BEGIN
                SELECT 'Error' AS Resultado, 'Periodo no válido' AS Mensaje;
                RETURN;
            END
            
            UPDATE Presupuestos
            SET Id_Periodo = @IdPeriodo
            WHERE Id_Presupuesto = @IdPresupuesto;
        END
        
        IF @MontoTotal IS NOT NULL
        BEGIN
            UPDATE Presupuestos
            SET Monto_Total = @MontoTotal
            WHERE Id_Presupuesto = @IdPresupuesto;
        END
        
        IF @Objetivo IS NOT NULL
        BEGIN
            UPDATE Presupuestos
            SET Objetivo = @Objetivo
            WHERE Id_Presupuesto = @IdPresupuesto;
        END
        
        IF @IdEstado IS NOT NULL
        BEGIN
            -- Validar estado
            IF NOT EXISTS (SELECT 1 FROM Estados WHERE Id_Estado = @IdEstado)
            BEGIN
                SELECT 'Error' AS Resultado, 'Estado no válido' AS Mensaje;
                RETURN;
            END
            
            UPDATE Presupuestos
            SET Id_Estado = @IdEstado
            WHERE Id_Presupuesto = @IdPresupuesto;
        END
        
        -- Actualizar detalles si se proporcionan
        IF EXISTS (SELECT 1 FROM @DetallesPresupuesto)
        BEGIN
            -- Eliminar detalles existentes
            DELETE FROM Detalles_Presupuesto
            WHERE Id_Presupuesto = @IdPresupuesto;
            
            -- Insertar nuevos detalles
            -- Dependiendo del tipo de presupuesto, usamos Id_Categoria como Id_Categoria_Ingreso o Id_Categoria_Gasto
            IF @IdTipoPresupuesto = 2 -- Ingreso
            BEGIN
                INSERT INTO Detalles_Presupuesto (
                    Id_Presupuesto,
                    Id_Categoria_Ingreso,
                    Id_Categoria_Gasto,
                    Monto_Asignado
                )
                SELECT 
                    @IdPresupuesto,
                    dp.Id_Categoria, -- Aquí usamos Id_Categoria como Id_Categoria_Ingreso
                    NULL,
                    dp.Monto_Asignado
                FROM @DetallesPresupuesto dp;
            END
            ELSE IF @IdTipoPresupuesto = 1 -- Gasto
            BEGIN
                INSERT INTO Detalles_Presupuesto (
                    Id_Presupuesto,
                    Id_Categoria_Ingreso,
                    Id_Categoria_Gasto,
                    Monto_Asignado
                )
                SELECT 
                    @IdPresupuesto,
                    NULL,
                    dp.Id_Categoria, -- Aquí usamos Id_Categoria como Id_Categoria_Gasto
                    dp.Monto_Asignado
                FROM @DetallesPresupuesto dp;
            END
            
            -- Recalcular monto usado
            DECLARE @IdUsuario INT;
            
            SELECT @IdUsuario = Id_Usuario
            FROM Presupuestos
            WHERE Id_Presupuesto = @IdPresupuesto;
            
            DECLARE @IdPeriodoActual INT;
            
            SELECT @IdPeriodoActual = Id_Periodo
            FROM Presupuestos
            WHERE Id_Presupuesto = @IdPresupuesto;
            
            IF @IdTipoPresupuesto = 1 -- Gasto
            BEGIN
                UPDATE p
                SET p.Monto_Usado = (
                    SELECT COALESCE(SUM(g.Monto), 0)
                    FROM Gastos g
                    INNER JOIN Detalles_Presupuesto dp ON g.Id_Categoria_Gasto = dp.Id_Categoria_Gasto
                    WHERE g.Id_Usuario = @IdUsuario
                    AND dp.Id_Presupuesto = @IdPresupuesto
                    AND (
                        (@IdPeriodoActual = 3 AND MONTH(g.Fecha) = MONTH(GETDATE()) AND YEAR(g.Fecha) = YEAR(GETDATE())) -- Mensual
                        OR
                        (@IdPeriodoActual = 5 AND YEAR(g.Fecha) = YEAR(GETDATE())) -- Anual
                    )
                )
                FROM Presupuestos p
                WHERE p.Id_Presupuesto = @IdPresupuesto;
            END
            ELSE IF @IdTipoPresupuesto = 2 -- Ingreso
            BEGIN
                UPDATE p
                SET p.Monto_Usado = (
                    SELECT COALESCE(SUM(i.Monto), 0)
                    FROM Ingresos i
                    INNER JOIN Detalles_Presupuesto dp ON i.Id_Categoria_Ingreso = dp.Id_Categoria_Ingreso
                    WHERE i.Id_Usuario = @IdUsuario
                    AND dp.Id_Presupuesto = @IdPresupuesto
                    AND (
                        (@IdPeriodoActual = 3 AND MONTH(i.Fecha) = MONTH(GETDATE()) AND YEAR(i.Fecha) = YEAR(GETDATE())) -- Mensual
                        OR
                        (@IdPeriodoActual = 5 AND YEAR(i.Fecha) = YEAR(GETDATE())) -- Anual
                    )
                )
                FROM Presupuestos p
                WHERE p.Id_Presupuesto = @IdPresupuesto;
            END
        END
        
        SELECT 'Éxito' AS Resultado, 'Presupuesto actualizado correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--Procedimientos para gestionar tips financieros
-- 9. Obtener tips financieros con filtros
CREATE PROCEDURE GET_ObtenerTips
    @IdImpacto INT = NULL,
    @IdFlexibilidad INT = NULL,
    @Busqueda VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.Id_Tip,
        t.Titulo,
        t.Icono,
        t.Definicion,
        t.Porcentaje_Ingresos,
        i.Impacto,
        f.Flexibilidad,
        t.Fecha_Creacion,
        e.Estado
    FROM Tips_Financieros t
    INNER JOIN Impactos_Tips i ON t.Id_Impacto = i.Id_Impacto
    INNER JOIN Flexibilidades_Tips f ON t.Id_Flexibilidad = f.Id_Flexibilidad
    INNER JOIN Estados e ON t.Id_Estado = e.Id_Estado
    WHERE (@IdImpacto IS NULL OR t.Id_Impacto = @IdImpacto)
    AND (@IdFlexibilidad IS NULL OR t.Id_Flexibilidad = @IdFlexibilidad)
    AND (@Busqueda IS NULL OR t.Titulo LIKE '%' + @Busqueda + '%' OR t.Definicion LIKE '%' + @Busqueda + '%')
    AND t.Id_Estado = 1 -- Solo activos
    ORDER BY t.Fecha_Creacion DESC;
    
    -- Obtener ejemplos para los tips
    SELECT 
        et.Id_Ejemplo,
        et.Id_Tip,
        et.Nombre_Ejemplo,
        et.Descripcion,
        et.Consejo
    FROM Ejemplos_Tips et
    INNER JOIN Tips_Financieros t ON et.Id_Tip = t.Id_Tip
    WHERE (@IdImpacto IS NULL OR t.Id_Impacto = @IdImpacto)
    AND (@IdFlexibilidad IS NULL OR t.Id_Flexibilidad = @IdFlexibilidad)
    AND (@Busqueda IS NULL OR t.Titulo LIKE '%' + @Busqueda + '%' OR t.Definicion LIKE '%' + @Busqueda + '%')
    AND t.Id_Estado = 1
    ORDER BY et.Id_Tip;
    
    -- Obtener recursos para los tips
    SELECT 
        rt.Id_Recurso,
        rt.Id_Tip,
        rt.Id_Tipo_Recurso,
        tr.Tipo_Recurso,
        rt.Titulo,
        rt.Url,
        rt.Descripcion
    FROM Recursos_Tips rt
    INNER JOIN Tips_Financieros t ON rt.Id_Tip = t.Id_Tip
    INNER JOIN Tipos_Recurso tr ON rt.Id_Tipo_Recurso = tr.Id_Tipo_Recurso
    WHERE (@IdImpacto IS NULL OR t.Id_Impacto = @IdImpacto)
    AND (@IdFlexibilidad IS NULL OR t.Id_Flexibilidad = @IdFlexibilidad)
    AND (@Busqueda IS NULL OR t.Titulo LIKE '%' + @Busqueda + '%' OR t.Definicion LIKE '%' + @Busqueda + '%')
    AND t.Id_Estado = 1
    ORDER BY rt.Id_Tip;
END;
GO

-- 10. Obtener detalles completos de un tip
CREATE PROCEDURE GET_ObtenerDetalleTip
    @IdTip INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Información básica del tip
    SELECT 
        t.Id_Tip,
        t.Titulo,
        t.Icono,
        t.Definicion,
        t.Porcentaje_Ingresos,
        i.Impacto,
        f.Flexibilidad,
        t.Fecha_Creacion
    FROM Tips_Financieros t
    INNER JOIN Impactos_Tips i ON t.Id_Impacto = i.Id_Impacto
    INNER JOIN Flexibilidades_Tips f ON t.Id_Flexibilidad = f.Id_Flexibilidad
    WHERE t.Id_Tip = @IdTip
    AND t.Id_Estado = 1;
    
    -- Ejemplos del tip
    SELECT 
        Id_Ejemplo,
        Nombre_Ejemplo,
        Descripcion,
        Consejo
    FROM Ejemplos_Tips
    WHERE Id_Tip = @IdTip
    ORDER BY Id_Ejemplo;
    
    -- Secciones del tip
    SELECT 
        Id_Seccion,
        Titulo_Seccion,
        Descripcion,
        Estadistica,
        Orden
    FROM Secciones_Tips
    WHERE Id_Tip = @IdTip
    ORDER BY Orden;
    
    -- Items de cada sección
    SELECT 
        ist.Id_Item,
        ist.Id_Seccion,
        ist.Item,
        ist.Orden,
        st.Titulo_Seccion
    FROM Items_Seccion ist
    INNER JOIN Secciones_Tips st ON ist.Id_Seccion = st.Id_Seccion
    WHERE st.Id_Tip = @IdTip
    ORDER BY ist.Id_Seccion, ist.Orden;
    
    -- Recursos del tip
    SELECT 
        rt.Id_Recurso,
        rt.Id_Tipo_Recurso,
        tr.Tipo_Recurso,
        rt.Titulo,
        rt.Url,
        rt.Descripcion
    FROM Recursos_Tips rt
    INNER JOIN Tipos_Recurso tr ON rt.Id_Tipo_Recurso = tr.Id_Tipo_Recurso
    WHERE rt.Id_Tip = @IdTip
    ORDER BY rt.Id_Recurso;
END;
GO

--MOSTRAR TODOS LOS USUARIOS
CREATE PROCEDURE GET_ObtenerUsuarios
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id_Usuario,
        Email,
        Nombre_Usuario,
        Foto_Perfil,
        Fecha_Registro,
        Ultimo_Login,
        e.Estado
    FROM Usuarios u
    INNER JOIN Estados e ON u.Id_Estado = e.Id_Estado
    ORDER BY Nombre_Usuario;
END;
GO

--MOSTRAR USUARIO POR ID
CREATE PROCEDURE GET_ObtenerUsuarioPorId
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id_Usuario,
        Email,
        Nombre_Usuario,
        Foto_Perfil,
        Fecha_Registro,
        Ultimo_Login,
        e.Estado
    FROM Usuarios u
    INNER JOIN Estados e ON u.Id_Estado = e.Id_Estado
    WHERE Id_Usuario = @IdUsuario;
END;
GO

--ELIMINAR USUARIO
CREATE PROCEDURE DELETE_Usuario
    @IdUsuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE Usuarios
        SET Id_Estado = 4 -- Eliminado
        WHERE Id_Usuario = @IdUsuario;
        
        SELECT 'Éxito' AS Resultado, 'Usuario marcado como eliminado' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

--OBTENER CATEGORIAS DE INGRESOS
CREATE PROCEDURE GET_CategoriasIngresos
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id_Categoria_Ingreso,
        Nombre_Categoria_Ingreso,
        Icono,
        Color,
        Descripcion,
        Meta_Mensual
    FROM Categorias_Ingresos
    ORDER BY Nombre_Categoria_Ingreso;
END;
GO

--CREAR NUEVA CATEGORIA DE INGRESO
CREATE PROCEDURE POST_CrearCategoriaIngreso
    @NombreCategoria VARCHAR(50),
    @Icono VARCHAR(50),
    @Color VARCHAR(20),
    @Descripcion VARCHAR(255) = NULL,
    @MetaMensual DECIMAL(10,2) = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si la categoría ya existe
        IF EXISTS (SELECT 1 FROM Categorias_Ingresos WHERE Nombre_Categoria_Ingreso = @NombreCategoria)
        BEGIN
            SELECT 'Error' AS Resultado, 'La categoría ya existe' AS Mensaje;
            RETURN;
        END
        
        -- Insertar nueva categoría
        INSERT INTO Categorias_Ingresos (
            Nombre_Categoria_Ingreso,
            Icono,
            Color,
            Descripcion,
            Meta_Mensual
        )
        VALUES (
            @NombreCategoria,
            @Icono,
            @Color,
            @Descripcion,
            @MetaMensual
        );
        
        SELECT 'Éxito' AS Resultado, 'Categoría creada correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Categoria_Ingreso;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

--ACTUALIZAR CATEGORIA DE INGRESO
CREATE PROCEDURE PUT_CategoriaIngreso
    @IdCategoriaIngreso INT,
    @NombreCategoria VARCHAR(50) = NULL,
    @Icono VARCHAR(50) = NULL,
    @Color VARCHAR(20) = NULL,
    @Descripcion VARCHAR(255) = NULL,
    @MetaMensual DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si la categoría existe
        IF NOT EXISTS (SELECT 1 FROM Categorias_Ingresos WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso)
        BEGIN
            SELECT 'Error' AS Resultado, 'Categoría no encontrada' AS Mensaje;
            RETURN;
        END
        
        -- Actualizar campos si se proporcionan
        IF @NombreCategoria IS NOT NULL
        BEGIN
            -- Verificar que el nuevo nombre no esté en uso
            IF EXISTS (SELECT 1 FROM Categorias_Ingresos WHERE Nombre_Categoria_Ingreso = @NombreCategoria AND Id_Categoria_Ingreso <> @IdCategoriaIngreso)
            BEGIN
                SELECT 'Error' AS Resultado, 'El nombre de categoría ya está en uso' AS Mensaje;
                RETURN;
            END
            
            UPDATE Categorias_Ingresos
            SET Nombre_Categoria_Ingreso = @NombreCategoria
            WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        END
        
        IF @Icono IS NOT NULL
        BEGIN
            UPDATE Categorias_Ingresos
            SET Icono = @Icono
            WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        END
        
        IF @Color IS NOT NULL
        BEGIN
            UPDATE Categorias_Ingresos
            SET Color = @Color
            WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        END
        
        IF @Descripcion IS NOT NULL
        BEGIN
            UPDATE Categorias_Ingresos
            SET Descripcion = @Descripcion
            WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        END
        
        IF @MetaMensual IS NOT NULL
        BEGIN
            UPDATE Categorias_Ingresos
            SET Meta_Mensual = @MetaMensual
            WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        END
        
        SELECT 'Éxito' AS Resultado, 'Categoría actualizada correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--ELIMINAR CATEGORIA DE INGRESO
CREATE PROCEDURE DELETE_CategoriaIngreso
    @IdCategoriaIngreso INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si la categoría tiene ingresos asociados
        IF EXISTS (SELECT 1 FROM Ingresos WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso)
        BEGIN
            SELECT 'Error' AS Resultado, 'No se puede eliminar la categoría porque tiene ingresos asociados' AS Mensaje;
            RETURN;
        END
        
        -- Verificar si la categoría está en detalles de presupuesto
        IF EXISTS (SELECT 1 FROM Detalles_Presupuesto WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso)
        BEGIN
            SELECT 'Error' AS Resultado, 'No se puede eliminar la categoría porque está asociada a presupuestos' AS Mensaje;
            RETURN;
        END
        
        -- Eliminar la categoría
        DELETE FROM Categorias_Ingresos
        WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso;
        
        SELECT 'Éxito' AS Resultado, 'Categoría eliminada correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--OBTENER INGRESOS POR USUARIO
CREATE PROCEDURE GET_IngresosUsuario
    @IdUsuario INT,
    @Mes INT = NULL,
    @Anio INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.Id_Ingreso,
        i.Id_Categoria_Ingreso,
        ci.Nombre_Categoria_Ingreso,
        ci.Icono,
        ci.Color,
        i.Monto,
        i.Fecha,
        i.Descripcion
    FROM Ingresos i
    INNER JOIN Categorias_Ingresos ci ON i.Id_Categoria_Ingreso = ci.Id_Categoria_Ingreso
    WHERE i.Id_Usuario = @IdUsuario
    AND (@Mes IS NULL OR MONTH(i.Fecha) = @Mes)
    AND (@Anio IS NULL OR YEAR(i.Fecha) = @Anio)
    ORDER BY i.Fecha DESC;
END;
GO

--ACTUALIZAR INGRESO
CREATE PROCEDURE PUT_Ingreso
    @IdIngreso VARCHAR(10),
    @IdCategoriaIngreso INT = NULL,
    @Monto DECIMAL(10,2) = NULL,
    @Fecha DATETIME = NULL,
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si el ingreso existe
        IF NOT EXISTS (SELECT 1 FROM Ingresos WHERE Id_Ingreso = @IdIngreso)
        BEGIN
            SELECT 'Error' AS Resultado, 'Ingreso no encontrado' AS Mensaje;
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Obtener datos actuales para comparar
        DECLARE @IdUsuario INT;
        DECLARE @IdCategoriaActual INT;
        DECLARE @MontoActual DECIMAL(10,2);
        DECLARE @FechaActual DATETIME;
        
        SELECT 
            @IdUsuario = Id_Usuario,
            @IdCategoriaActual = Id_Categoria_Ingreso,
            @MontoActual = Monto,
            @FechaActual = Fecha
        FROM Ingresos
        WHERE Id_Ingreso = @IdIngreso;
        
        -- Actualizar campos si se proporcionan
        IF @IdCategoriaIngreso IS NOT NULL AND @IdCategoriaIngreso <> @IdCategoriaActual
        BEGIN
            -- Verificar que la nueva categoría existe
            IF NOT EXISTS (SELECT 1 FROM Categorias_Ingresos WHERE Id_Categoria_Ingreso = @IdCategoriaIngreso)
            BEGIN
                SELECT 'Error' AS Resultado, 'Categoría no válida' AS Mensaje;
                IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                RETURN;
            END
            
            UPDATE Ingresos
            SET Id_Categoria_Ingreso = @IdCategoriaIngreso
            WHERE Id_Ingreso = @IdIngreso;
        END
        
        IF @Monto IS NOT NULL AND @Monto <> @MontoActual
        BEGIN
            UPDATE Ingresos
            SET Monto = @Monto
            WHERE Id_Ingreso = @IdIngreso;
            
            -- Actualizar presupuestos afectados
            UPDATE p
            SET p.Monto_Usado = p.Monto_Usado - @MontoActual + @Monto
            FROM Presupuestos p
            INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
            WHERE p.Id_Usuario = @IdUsuario
            AND p.Id_Estado = 1
            AND dp.Id_Categoria_Ingreso = ISNULL(@IdCategoriaIngreso, @IdCategoriaActual)
            AND (
                (p.Id_Periodo = 3 AND MONTH(@FechaActual) = MONTH(GETDATE()) AND YEAR(@FechaActual) = YEAR(GETDATE())) -- Mensual
                OR
                (p.Id_Periodo = 5 AND YEAR(@FechaActual) = YEAR(GETDATE())) -- Anual
            );
        END
        
        IF @Fecha IS NOT NULL AND @Fecha <> @FechaActual
        BEGIN
            UPDATE Ingresos
            SET Fecha = @Fecha
            WHERE Id_Ingreso = @IdIngreso;
        END
        
        IF @Descripcion IS NOT NULL
        BEGIN
            UPDATE Ingresos
            SET Descripcion = @Descripcion
            WHERE Id_Ingreso = @IdIngreso;
        END
        
        SELECT 'Éxito' AS Resultado, 'Ingreso actualizado correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--ELIMINAR INGRESO
CREATE PROCEDURE DELETE_Ingreso
    @IdIngreso VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Obtener datos del ingreso para actualizar presupuestos
        DECLARE @IdUsuario INT;
        DECLARE @IdCategoriaIngreso INT;
        DECLARE @Monto DECIMAL(10,2);
        DECLARE @Fecha DATETIME;
        
        SELECT 
            @IdUsuario = Id_Usuario,
            @IdCategoriaIngreso = Id_Categoria_Ingreso,
            @Monto = Monto,
            @Fecha = Fecha
        FROM Ingresos
        WHERE Id_Ingreso = @IdIngreso;
        
        -- Eliminar el ingreso
        DELETE FROM Ingresos
        WHERE Id_Ingreso = @IdIngreso;
        
        -- Actualizar presupuestos afectados
        UPDATE p
        SET p.Monto_Usado = p.Monto_Usado - @Monto
        FROM Presupuestos p
        INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
        WHERE p.Id_Usuario = @IdUsuario
        AND p.Id_Estado = 1
        AND dp.Id_Categoria_Ingreso = @IdCategoriaIngreso
        AND (
            (p.Id_Periodo = 3 AND MONTH(@Fecha) = MONTH(GETDATE()) AND YEAR(@Fecha) = YEAR(GETDATE())) -- Mensual
            OR
            (p.Id_Periodo = 5 AND YEAR(@Fecha) = YEAR(GETDATE())) -- Anual
        );
        
        SELECT 'Éxito' AS Resultado, 'Ingreso eliminado correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--OBTENER PRESUPUESTO POR USUARIO
CREATE PROCEDURE GET_PresupuestosUsuario
    @IdUsuario INT,
    @IdEstado INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id_Presupuesto,
        p.Nombre_Presupuesto,
        tp.Tipo_Presupuesto,
        pp.Periodo,
        p.Monto_Total,
        p.Monto_Usado,
        (p.Monto_Usado / p.Monto_Total * 100) AS Porcentaje_Usado,
        p.Objetivo,
        p.Fecha_Creacion,
        e.Estado
    FROM Presupuestos p
    INNER JOIN Tipos_Presupuesto tp ON p.Id_Tipo_Presupuesto = tp.Id_Tipo_Presupuesto
    INNER JOIN Periodos_Presupuesto pp ON p.Id_Periodo = pp.Id_Periodo
    INNER JOIN Estados e ON p.Id_Estado = e.Id_Estado
    WHERE p.Id_Usuario = @IdUsuario
    AND (@IdEstado IS NULL OR p.Id_Estado = @IdEstado)
    ORDER BY p.Id_Estado, p.Fecha_Creacion DESC;
END;
GO

--OBTENER DETALLES DE UN PRESUPUESTO
CREATE PROCEDURE GET_DetallesPresupuesto
    @IdPresupuesto INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Información básica del presupuesto
    SELECT 
        p.Id_Presupuesto,
        p.Nombre_Presupuesto,
        tp.Tipo_Presupuesto,
        pp.Periodo,
        p.Monto_Total,
        p.Monto_Usado,
        (p.Monto_Usado / p.Monto_Total * 100) AS Porcentaje_Usado,
        p.Objetivo,
        p.Fecha_Creacion,
        e.Estado
    FROM Presupuestos p
    INNER JOIN Tipos_Presupuesto tp ON p.Id_Tipo_Presupuesto = tp.Id_Tipo_Presupuesto
    INNER JOIN Periodos_Presupuesto pp ON p.Id_Periodo = pp.Id_Periodo
    INNER JOIN Estados e ON p.Id_Estado = e.Id_Estado
    WHERE p.Id_Presupuesto = @IdPresupuesto;
    
    -- Detalles del presupuesto
    SELECT 
        dp.Id_Detalle_Presupuesto,
        dp.Id_Categoria_Ingreso,
        dp.Id_Categoria_Gasto,
        CASE 
            WHEN dp.Id_Categoria_Ingreso IS NOT NULL THEN ci.Nombre_Categoria_Ingreso
            ELSE cg.Nombre_Categoria_Gasto
        END AS Categoria,
        CASE 
            WHEN dp.Id_Categoria_Ingreso IS NOT NULL THEN ci.Icono
            ELSE cg.Icono
        END AS Icono,
        CASE 
            WHEN dp.Id_Categoria_Ingreso IS NOT NULL THEN ci.Color
            ELSE cg.Color
        END AS Color,
        dp.Monto_Asignado,
        CASE 
            WHEN dp.Id_Categoria_Ingreso IS NOT NULL THEN 
                (SELECT COALESCE(SUM(i.Monto), 0) 
                 FROM Ingresos i 
                 WHERE i.Id_Categoria_Ingreso = dp.Id_Categoria_Ingreso 
                 AND i.Id_Usuario = p.Id_Usuario
                 AND (
                     (p.Id_Periodo = 3 AND MONTH(i.Fecha) = MONTH(GETDATE()) AND YEAR(i.Fecha) = YEAR(GETDATE())) -- Mensual
                     OR
                     (p.Id_Periodo = 5 AND YEAR(i.Fecha) = YEAR(GETDATE())) -- Anual
                 ))
            ELSE 
                (SELECT COALESCE(SUM(g.Monto), 0) 
                 FROM Gastos g 
                 WHERE g.Id_Categoria_Gasto = dp.Id_Categoria_Gasto 
                 AND g.Id_Usuario = p.Id_Usuario
                 AND (
                     (p.Id_Periodo = 3 AND MONTH(g.Fecha) = MONTH(GETDATE()) AND YEAR(g.Fecha) = YEAR(GETDATE())) -- Mensual
                     OR
                     (p.Id_Periodo = 5 AND YEAR(g.Fecha) = YEAR(GETDATE())) -- Anual
                 ))
        END AS Monto_Usado
    FROM Detalles_Presupuesto dp
    LEFT JOIN Categorias_Ingresos ci ON dp.Id_Categoria_Ingreso = ci.Id_Categoria_Ingreso
    LEFT JOIN Categorias_Gastos cg ON dp.Id_Categoria_Gasto = cg.Id_Categoria_Gasto
    INNER JOIN Presupuestos p ON dp.Id_Presupuesto = p.Id_Presupuesto
    WHERE dp.Id_Presupuesto = @IdPresupuesto
    ORDER BY dp.Id_Detalle_Presupuesto;
END;
GO


--CREAR NUEVA META DE AHORRO
CREATE PROCEDURE POST_MetaAhorro
    @IdUsuario INT,
    @NombreMeta VARCHAR(100),
    @MontoObjetivo DECIMAL(10,2),
    @FechaObjetivo DATE = NULL,
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar usuario
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
        BEGIN
            SELECT 'Error' AS Resultado, 'Usuario no válido' AS Mensaje;
            RETURN;
        END
        
        -- Validar monto objetivo
        IF @MontoObjetivo <= 0
        BEGIN
            SELECT 'Error' AS Resultado, 'El monto objetivo debe ser mayor que cero' AS Mensaje;
            RETURN;
        END
        
        -- Insertar nueva meta
        INSERT INTO Metas_Ahorro (
            Id_Usuario,
            Nombre_Meta,
            Monto_Objetivo,
            Fecha_Objetivo,
            Descripcion,
            Id_Estado
        )
        VALUES (
            @IdUsuario,
            @NombreMeta,
            @MontoObjetivo,
            @FechaObjetivo,
            @Descripcion,
            1 -- Activo
        );
        
        SELECT 'Éxito' AS Resultado, 'Meta de ahorro creada correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Meta_Ahorro;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--VER METAS DE AHORRO POR USUARIO
CREATE PROCEDURE GET_MetasAhorroUsuario
    @IdUsuario INT,
    @IdEstado INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ma.Id_Meta_Ahorro,
        ma.Nombre_Meta,
        ma.Monto_Objetivo,
        ma.Monto_Acumulado,
        (ma.Monto_Acumulado / ma.Monto_Objetivo * 100) AS Porcentaje_Completado,
        ma.Fecha_Objetivo,
        ma.Descripcion,
        ma.Fecha_Creacion,
        e.Estado
    FROM Metas_Ahorro ma
    INNER JOIN Estados e ON ma.Id_Estado = e.Id_Estado
    WHERE ma.Id_Usuario = @IdUsuario
    AND (@IdEstado IS NULL OR ma.Id_Estado = @IdEstado)
    ORDER BY 
        CASE WHEN ma.Fecha_Objetivo IS NULL THEN 1 ELSE 0 END,
        ma.Fecha_Objetivo,
        ma.Id_Meta_Ahorro;
END;
GO


--AGREGAR TRANSACCION A META DE AHORRO
CREATE PROCEDURE POST_TransaccionAhorro
    @IdMetaAhorro INT,
    @Monto DECIMAL(10,2),
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar meta de ahorro
        DECLARE @IdUsuario INT;
        DECLARE @MontoObjetivo DECIMAL(10,2);
        DECLARE @MontoAcumulado DECIMAL(10,2);
        DECLARE @IdEstado INT;
        
        SELECT 
            @IdUsuario = Id_Usuario,
            @MontoObjetivo = Monto_Objetivo,
            @MontoAcumulado = Monto_Acumulado,
            @IdEstado = Id_Estado
        FROM Metas_Ahorro
        WHERE Id_Meta_Ahorro = @IdMetaAhorro;
        
        IF @IdUsuario IS NULL
        BEGIN
            SELECT 'Error' AS Resultado, 'Meta de ahorro no encontrada' AS Mensaje;
            RETURN;
        END
        
        IF @IdEstado <> 1 -- No está activa
        BEGIN
            SELECT 'Error' AS Resultado, 'La meta de ahorro no está activa' AS Mensaje;
            RETURN;
        END
        
        -- Validar monto
        IF @Monto <= 0
        BEGIN
            SELECT 'Error' AS Resultado, 'El monto debe ser mayor que cero' AS Mensaje;
            RETURN;
        END
        
        -- Insertar transacción
        INSERT INTO Transacciones_Ahorro (
            Id_Meta_Ahorro,
            Monto,
            Descripcion,
            Id_Estado
        )
        VALUES (
            @IdMetaAhorro,
            @Monto,
            @Descripcion,
            1 -- Activo
        );
        
        -- Actualizar monto acumulado
        UPDATE Metas_Ahorro
        SET Monto_Acumulado = Monto_Acumulado + @Monto
        WHERE Id_Meta_Ahorro = @IdMetaAhorro;
        
        -- Verificar si se completó la meta
        IF (@MontoAcumulado + @Monto) >= @MontoObjetivo
        BEGIN
            UPDATE Metas_Ahorro
            SET Id_Estado = 2 -- Completado
            WHERE Id_Meta_Ahorro = @IdMetaAhorro;
            
            SELECT 'Éxito' AS Resultado, '¡Felicidades! Has completado tu meta de ahorro' AS Mensaje, SCOPE_IDENTITY() AS Id_Transaccion_Ahorro;
        END
        ELSE
        BEGIN
            SELECT 'Éxito' AS Resultado, 'Transacción registrada correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Transaccion_Ahorro;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--CREAR NUEVO RECORDATORIO
CREATE PROCEDURE POST_Recordatorio
    @IdUsuario INT,
    @IdTipoRecordatorio INT,
    @Titulo VARCHAR(100),
    @Descripcion VARCHAR(255) = NULL,
    @FechaRecordatorio DATETIME,
    @Repetir BIT = 0,
    @Frecuencia VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar usuario
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Id_Usuario = @IdUsuario AND Id_Estado = 1)
        BEGIN
            SELECT 'Error' AS Resultado, 'Usuario no válido' AS Mensaje;
            RETURN;
        END
        
        -- Validar tipo de recordatorio
        IF NOT EXISTS (SELECT 1 FROM Tipos_Recordatorio WHERE Id_Tipo_Recordatorio = @IdTipoRecordatorio)
        BEGIN
            SELECT 'Error' AS Resultado, 'Tipo de recordatorio no válido' AS Mensaje;
            RETURN;
        END
        
        -- Validar fecha
        IF @FechaRecordatorio < GETDATE()
        BEGIN
            SELECT 'Error' AS Resultado, 'La fecha del recordatorio no puede ser en el pasado' AS Mensaje;
            RETURN;
        END
        
        -- Validar frecuencia si es recurrente
        IF @Repetir = 1 AND @Frecuencia IS NULL
        BEGIN
            SELECT 'Error' AS Resultado, 'Debe especificar una frecuencia para recordatorios recurrentes' AS Mensaje;
            RETURN;
        END
        
        -- Insertar nuevo recordatorio
        INSERT INTO Recordatorios (
            Id_Usuario,
            Id_Tipo_Recordatorio,
            Titulo,
            Descripcion,
            Fecha_Recordatorio,
            Repetir,
            Frecuencia,
            Id_Estado
        )
        VALUES (
            @IdUsuario,
            @IdTipoRecordatorio,
            @Titulo,
            @Descripcion,
            @FechaRecordatorio,
            @Repetir,
            @Frecuencia,
            1 -- Activo
        );
        
        SELECT 'Éxito' AS Resultado, 'Recordatorio creado correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Recordatorio;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--VER RECORDATORIOS POR USUARIO
CREATE PROCEDURE GET_RecordatoriosUsuario
    @IdUsuario INT,
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL,
    @IdTipoRecordatorio INT = NULL,
    @IdEstado INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Si no se proporcionan fechas, mostrar los próximos 30 días
    IF @FechaInicio IS NULL
        SET @FechaInicio = GETDATE();
    
    IF @FechaFin IS NULL
        SET @FechaFin = DATEADD(DAY, 30, GETDATE());
    
    SELECT 
        r.Id_Recordatorio,
        r.Id_Tipo_Recordatorio,
        tr.Tipo_Recordatorio,
        r.Titulo,
        r.Descripcion,
        r.Fecha_Recordatorio,
        r.Repetir,
        r.Frecuencia,
        e.Estado
    FROM Recordatorios r
    INNER JOIN Tipos_Recordatorio tr ON r.Id_Tipo_Recordatorio = tr.Id_Tipo_Recordatorio
    INNER JOIN Estados e ON r.Id_Estado = e.Id_Estado
    WHERE r.Id_Usuario = @IdUsuario
    AND r.Fecha_Recordatorio BETWEEN @FechaInicio AND @FechaFin
    AND (@IdTipoRecordatorio IS NULL OR r.Id_Tipo_Recordatorio = @IdTipoRecordatorio)
    AND (@IdEstado IS NULL OR r.Id_Estado = @IdEstado)
    ORDER BY r.Fecha_Recordatorio;
END;
GO

-- Obtener gastos por usuario
CREATE PROCEDURE GET_GastosPorUsuario
    @IdUsuario INT,
    @Mes INT = NULL,
    @Anio INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        g.Id_Gasto,
        g.Id_Categoria_Gasto,
        cg.Nombre_Categoria_Gasto,
        cg.Icono,
        cg.Color,
        g.Monto,
        g.Fecha,
        g.Descripcion
    FROM Gastos g
    INNER JOIN Categorias_Gastos cg ON g.Id_Categoria_Gasto = cg.Id_Categoria_Gasto
    WHERE g.Id_Usuario = @IdUsuario
    AND (@Mes IS NULL OR MONTH(g.Fecha) = @Mes)
    AND (@Anio IS NULL OR YEAR(g.Fecha) = @Anio)
    ORDER BY g.Fecha DESC;
END;
GO


-- Actualizar gasto
CREATE PROCEDURE PUT_Gasto
    @IdGasto VARCHAR(10),
    @IdCategoriaGasto INT = NULL,
    @Monto DECIMAL(10,2) = NULL,
    @Fecha DATETIME = NULL,
    @Descripcion VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si el gasto existe
        IF NOT EXISTS (SELECT 1 FROM Gastos WHERE Id_Gasto = @IdGasto)
        BEGIN
            SELECT 'Error' AS Resultado, 'Gasto no encontrado' AS Mensaje;
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Obtener datos actuales para comparar
        DECLARE @IdUsuario INT;
        DECLARE @IdCategoriaActual INT;
        DECLARE @MontoActual DECIMAL(10,2);
        DECLARE @FechaActual DATETIME;

        SELECT 
            @IdUsuario = Id_Usuario,
            @IdCategoriaActual = Id_Categoria_Gasto,
            @MontoActual = Monto,
            @FechaActual = Fecha
        FROM Gastos
        WHERE Id_Gasto = @IdGasto;

        -- Actualizar categoría si se proporciona y es diferente
        IF @IdCategoriaGasto IS NOT NULL AND @IdCategoriaGasto <> @IdCategoriaActual
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM Categorias_Gastos WHERE Id_Categoria_Gasto = @IdCategoriaGasto)
            BEGIN
                SELECT 'Error' AS Resultado, 'Categoría no válida' AS Mensaje;
                IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                RETURN;
            END

            UPDATE Gastos
            SET Id_Categoria_Gasto = @IdCategoriaGasto
            WHERE Id_Gasto = @IdGasto;
        END

        -- Actualizar monto si se proporciona y es diferente
        IF @Monto IS NOT NULL AND @Monto <> @MontoActual
        BEGIN
            UPDATE Gastos
            SET Monto = @Monto
            WHERE Id_Gasto = @IdGasto;

            -- Actualizar presupuestos afectados
            UPDATE p
            SET p.Monto_Usado = p.Monto_Usado - @MontoActual + @Monto
            FROM Presupuestos p
            INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
            WHERE p.Id_Usuario = @IdUsuario
            AND p.Id_Estado = 1
            AND dp.Id_Categoria_Gasto = ISNULL(@IdCategoriaGasto, @IdCategoriaActual)
            AND (
                (p.Id_Periodo = 3 AND MONTH(@FechaActual) = MONTH(GETDATE()) AND YEAR(@FechaActual) = YEAR(GETDATE())) -- Mensual
                OR
                (p.Id_Periodo = 5 AND YEAR(@FechaActual) = YEAR(GETDATE())) -- Anual
            );
        END

        -- Actualizar fecha si se proporciona y es diferente
        IF @Fecha IS NOT NULL AND @Fecha <> @FechaActual
        BEGIN
            UPDATE Gastos
            SET Fecha = @Fecha
            WHERE Id_Gasto = @IdGasto;
        END

        -- Actualizar descripción si se proporciona
        IF @Descripcion IS NOT NULL
        BEGIN
            UPDATE Gastos
            SET Descripcion = @Descripcion
            WHERE Id_Gasto = @IdGasto;
        END

        SELECT 'Éxito' AS Resultado, 'Gasto actualizado correctamente' AS Mensaje;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--MARCAR RECORDATORIO COMO COMPLETADO
CREATE PROCEDURE PUT_CompletarRecordatorio
    @IdRecordatorio INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si el recordatorio existe
        IF NOT EXISTS (SELECT 1 FROM Recordatorios WHERE Id_Recordatorio = @IdRecordatorio)
        BEGIN
            SELECT 'Error' AS Resultado, 'Recordatorio no encontrado' AS Mensaje;
            RETURN;
        END
        
        -- Obtener datos del recordatorio
        DECLARE @Repetir BIT;
        DECLARE @Frecuencia VARCHAR(50);
        DECLARE @FechaOriginal DATETIME;
        
        SELECT 
            @Repetir = Repetir,
            @Frecuencia = Frecuencia,
            @FechaOriginal = Fecha_Recordatorio
        FROM Recordatorios
        WHERE Id_Recordatorio = @IdRecordatorio;
        
        -- Si no es recurrente, marcarlo como completado (inactivo)
        IF @Repetir = 0
        BEGIN
            UPDATE Recordatorios
            SET Id_Estado = 2 -- Completado/Inactivo
            WHERE Id_Recordatorio = @IdRecordatorio;
        END
        ELSE
        BEGIN
            -- Si es recurrente, actualizar la fecha según la frecuencia
            DECLARE @NuevaFecha DATETIME;
            
            IF @Frecuencia = 'Diario'
                SET @NuevaFecha = DATEADD(DAY, 1, @FechaOriginal);
            ELSE IF @Frecuencia = 'Semanal'
                SET @NuevaFecha = DATEADD(WEEK, 1, @FechaOriginal);
            ELSE IF @Frecuencia = 'Mensual'
                SET @NuevaFecha = DATEADD(MONTH, 1, @FechaOriginal);
            ELSE IF @Frecuencia = 'Anual'
                SET @NuevaFecha = DATEADD(YEAR, 1, @FechaOriginal);
            ELSE
                SET @NuevaFecha = DATEADD(DAY, 1, @FechaOriginal); -- Por defecto diario
            
            UPDATE Recordatorios
            SET Fecha_Recordatorio = @NuevaFecha
            WHERE Id_Recordatorio = @IdRecordatorio;
        END
        
        SELECT 'Éxito' AS Resultado, 'Recordatorio actualizado correctamente' AS Mensaje;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


--VER LAS CATEGORIAS DE GASTOS
CREATE PROCEDURE GET_CategoriasGastos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id_Categoria_Gasto,
        Nombre_Categoria_Gasto,
        Icono,
        Color,
        Descripcion,
        Presupuesto_Mensual,
        Id_Prioridad
    FROM Categorias_Gastos
    ORDER BY Nombre_Categoria_Gasto;
END;
GO


--ELIMINAR UNA CATEGORIA DE GASTO
CREATE PROCEDURE DELETE_CategoriaGasto
    @IdCategoriaGasto INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si la categoría tiene gastos asociados
        IF EXISTS (SELECT 1 FROM Gastos WHERE Id_Categoria_Gasto = @IdCategoriaGasto)
        BEGIN
            SELECT 'Error' AS Resultado, 'No se puede eliminar la categoría porque tiene gastos asociados' AS Mensaje;
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Verificar si la categoría está en detalles de presupuesto
        IF EXISTS (SELECT 1 FROM Detalles_Presupuesto WHERE Id_Categoria_Gasto = @IdCategoriaGasto)
        BEGIN
            SELECT 'Error' AS Resultado, 'No se puede eliminar la categoría porque está asociada a presupuestos' AS Mensaje;
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Eliminar la categoría
        DELETE FROM Categorias_Gastos
        WHERE Id_Categoria_Gasto = @IdCategoriaGasto;

        SELECT 'Éxito' AS Resultado, 'Categoría eliminada correctamente' AS Mensaje;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO


-- ELIMINAR UN GASTO
CREATE PROCEDURE DELETE_Gasto
    @IdGasto VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener datos del gasto para actualizar presupuestos
        DECLARE @IdUsuario INT;
        DECLARE @IdCategoriaGasto INT;
        DECLARE @Monto DECIMAL(10,2);
        DECLARE @Fecha DATETIME;

        SELECT 
            @IdUsuario = Id_Usuario,
            @IdCategoriaGasto = Id_Categoria_Gasto,
            @Monto = Monto,
            @Fecha = Fecha
        FROM Gastos
        WHERE Id_Gasto = @IdGasto;

        -- Eliminar el gasto
        DELETE FROM Gastos
        WHERE Id_Gasto = @IdGasto;

        -- Actualizar presupuestos afectados
        UPDATE p
        SET p.Monto_Usado = p.Monto_Usado - @Monto
        FROM Presupuestos p
        INNER JOIN Detalles_Presupuesto dp ON p.Id_Presupuesto = dp.Id_Presupuesto
        WHERE p.Id_Usuario = @IdUsuario
        AND p.Id_Estado = 1
        AND dp.Id_Categoria_Gasto = @IdCategoriaGasto
        AND (
            (p.Id_Periodo = 3 AND MONTH(@Fecha) = MONTH(GETDATE()) AND YEAR(@Fecha) = YEAR(GETDATE())) -- Mensual
            OR
            (p.Id_Periodo = 5 AND YEAR(@Fecha) = YEAR(GETDATE())) -- Anual
        );

        SELECT 'Éxito' AS Resultado, 'Gasto eliminado correctamente' AS Mensaje;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

--CREAR NUEVA CATEGORIA DE GASTO
CREATE PROCEDURE POST_CrearCategoriaGasto
    @NombreCategoria VARCHAR(50),
    @Icono VARCHAR(50),
    @Color VARCHAR(20),
    @Descripcion VARCHAR(255) = NULL,
    @PresupuestoMensual DECIMAL(10,2) = 0,
    @IdPrioridad INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si la categoría ya existe
        IF EXISTS (SELECT 1 FROM Categorias_Gastos WHERE Nombre_Categoria_Gasto = @NombreCategoria)
        BEGIN
            SELECT 'Error' AS Resultado, 'La categoría ya existe' AS Mensaje;
            RETURN;
        END

        -- Insertar nueva categoría
        INSERT INTO Categorias_Gastos (
            Nombre_Categoria_Gasto,
            Icono,
            Color,
            Descripcion,
            Presupuesto_Mensual,
            Id_Prioridad
        )
        VALUES (
            @NombreCategoria,
            @Icono,
            @Color,
            @Descripcion,
            @PresupuestoMensual,
            @IdPrioridad
        );

        SELECT 'Éxito' AS Resultado, 'Categoría creada correctamente' AS Mensaje, SCOPE_IDENTITY() AS Id_Categoria_Gasto;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

--ACTUALIZAR CATEGORIA DE GASTO
CREATE PROCEDURE PUT_CategoriaGasto
    @IdCategoriaGasto INT,
    @NombreCategoria VARCHAR(50) = NULL,
    @Icono VARCHAR(50) = NULL,
    @Color VARCHAR(20) = NULL,
    @Descripcion VARCHAR(255) = NULL,
    @PresupuestoMensual DECIMAL(10,2) = NULL,
    @IdPrioridad INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si la categoría existe
        IF NOT EXISTS (SELECT 1 FROM Categorias_Gastos WHERE Id_Categoria_Gasto = @IdCategoriaGasto)
        BEGIN
            SELECT 'Error' AS Resultado, 'Categoría no encontrada' AS Mensaje;
            RETURN;
        END

        -- Actualizar campos si se proporcionan
        IF @NombreCategoria IS NOT NULL
        BEGIN
            -- Verificar que el nuevo nombre no esté en uso
            IF EXISTS (SELECT 1 FROM Categorias_Gastos WHERE Nombre_Categoria_Gasto = @NombreCategoria AND Id_Categoria_Gasto <> @IdCategoriaGasto)
            BEGIN
                SELECT 'Error' AS Resultado, 'El nombre de categoría ya está en uso' AS Mensaje;
                RETURN;
            END

            UPDATE Categorias_Gastos
            SET Nombre_Categoria_Gasto = @NombreCategoria
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        IF @Icono IS NOT NULL
        BEGIN
            UPDATE Categorias_Gastos
            SET Icono = @Icono
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        IF @Color IS NOT NULL
        BEGIN
            UPDATE Categorias_Gastos
            SET Color = @Color
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        IF @Descripcion IS NOT NULL
        BEGIN
            UPDATE Categorias_Gastos
            SET Descripcion = @Descripcion
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        IF @PresupuestoMensual IS NOT NULL
        BEGIN
            UPDATE Categorias_Gastos
            SET Presupuesto_Mensual = @PresupuestoMensual
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        IF @IdPrioridad IS NOT NULL
        BEGIN
            UPDATE Categorias_Gastos
            SET Id_Prioridad = @IdPrioridad
            WHERE Id_Categoria_Gasto = @IdCategoriaGasto;
        END

        SELECT 'Éxito' AS Resultado, 'Categoría actualizada correctamente' AS Mensaje;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 'Error' AS Resultado, ERROR_MESSAGE() AS Mensaje;
    END CATCH
END;
GO

-- Primero eliminamos la restricción existente si existe
IF EXISTS (
    SELECT * FROM sys.check_constraints 
    WHERE name = 'CK_Categoria_Check'
)
BEGIN
    ALTER TABLE Detalles_Presupuesto
    DROP CONSTRAINT CK_Categoria_Check;
END
GO

-- Creamos una nueva restricción
ALTER TABLE Detalles_Presupuesto
ADD CONSTRAINT CK_Categoria_Check CHECK (
    (Id_Categoria_Ingreso IS NOT NULL AND Id_Categoria_Gasto IS NULL) OR
    (Id_Categoria_Ingreso IS NULL AND Id_Categoria_Gasto IS NOT NULL)
);
GO


ALTER TABLE Categorias_Gastos
ADD Es_Ahorro BIT DEFAULT 0;

UPDATE Categorias_Gastos
SET Es_Ahorro = 1
WHERE Nombre_Categoria_Gasto = 'Ahorros';



-- Insertar usuarios de prueba
INSERT INTO Usuarios (Email, Clave, Nombre_Usuario, Foto_Perfil, Fecha_Registro, Ultimo_Login, Id_Estado)
VALUES 
('usuario1@educacash.com', 'clave123', 'Juan Pérez', 'https://ejemplo.com/fotos/juan.jpg', GETDATE(), GETDATE(), 1),
('usuario2@educacash.com', 'clave123', 'María García', 'https://ejemplo.com/fotos/maria.jpg', GETDATE(), GETDATE(), 1),
('usuario3@educacash.com', 'clave123', 'Carlos López', NULL, GETDATE(), DATEADD(DAY, -5, GETDATE()), 1),
('inactivo@educacash.com', 'clave123', 'Usuario Inactivo', NULL, DATEADD(MONTH, -2, GETDATE()), DATEADD(MONTH, -1, GETDATE()), 2),
('suspendido@educacash.com', 'clave123', 'Usuario Suspendido', NULL, DATEADD(MONTH, -3, GETDATE()), DATEADD(MONTH, -2, GETDATE()), 3);


-- Insertar categorías de ingresos
INSERT INTO Categorias_Ingresos (Nombre_Categoria_Ingreso, Icono, Color, Descripcion, Meta_Mensual)
VALUES 
('Salario', 'dollar-sign', '#4CAF50', 'Ingresos por trabajo principal', 2000.00),
('Freelance', 'code', '#2196F3', 'Trabajos independientes', 500.00),
('Inversiones', 'trending-up', '#FFC107', 'Dividendos e intereses', 300.00),
('Regalos', 'gift', '#E91E63', 'Dinero recibido como regalo', 100.00),
('Otros Ingresos', 'plus-circle', '#9E9E9E', 'Otros ingresos no categorizados', 0.00);

-- Insertar categorías de gastos
INSERT INTO Categorias_Gastos (Nombre_Categoria_Gasto, Icono, Color, Descripcion, Presupuesto_Mensual, Id_Prioridad)
VALUES 
('Alimentación', 'shopping-cart', '#FF5722', 'Supermercado y comida', 400.00, 1),
('Transporte', 'bus', '#3F51B5', 'Gasolina, transporte público', 150.00, 2),
('Vivienda', 'home', '#673AB7', 'Renta, servicios públicos', 800.00, 1),
('Entretenimiento', 'film', '#009688', 'Cine, salidas, hobbies', 100.00, 3),
('Educación', 'book', '#795548', 'Libros, cursos, materiales', 200.00, 2),
('Salud', 'heart', '#F44336', 'Medicinas, consultas médicas', 100.00, 1),
('Ropa', 'shopping-bag', '#00BCD4', 'Prendas de vestir', 100.00, 3),
('Ahorros', 'dollar-sign', '#8BC34A', 'Dinero guardado para metas', 300.00, 2),
('Otros Gastos', 'minus-circle', '#607D8B', 'Gastos varios no categorizados', 50.00, 3);

INSERT INTO Ingresos (Id_Ingreso, Id_Usuario, Id_Categoria_Ingreso, Monto, Fecha, Descripcion)
VALUES 
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 1, 2100.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1), 'Pago nómina'),
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 2, 450.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 5), 'Proyecto freelance'),
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 3, 120.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 10), 'Dividendos inversión'),
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 2, 1, 1800.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1), 'Salario trabajo'),
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 2, 4, 50.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 15), 'Regalo cumpleaños'),
('ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 3, 1, 2500.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1), 'Pago mensual');

-- Insertar ingresos de meses anteriores para pruebas de historial
INSERT INTO Ingresos (Id_Ingreso, Id_Usuario, Id_Categoria_Ingreso, Monto, Fecha, Descripcion)
SELECT 
    'ING' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 
    u.Id_Usuario, 
    ci.Id_Categoria_Ingreso, 
    CASE 
        WHEN ci.Nombre_Categoria_Ingreso = 'Salario' THEN 1800.00 + (RAND() * 400)
        WHEN ci.Nombre_Categoria_Ingreso = 'Freelance' THEN 300.00 + (RAND() * 200)
        ELSE 50.00 + (RAND() * 100)
    END,
    DATEADD(MONTH, -m.meses, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1 + CAST(RAND() * 28 AS INT))),
    'Ingreso prueba ' + ci.Nombre_Categoria_Ingreso + ' mes ' + CAST(m.meses AS VARCHAR(10))
FROM Usuarios u
CROSS JOIN (VALUES (1), (2), (3)) AS m(meses)
CROSS JOIN Categorias_Ingresos ci
WHERE u.Id_Estado = 1 AND m.meses BETWEEN 1 AND 3;


-- Insertar gastos de prueba para el mes actual
INSERT INTO Gastos (Id_Gasto, Id_Usuario, Id_Categoria_Gasto, Monto, Fecha, Descripcion)
VALUES 
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 1, 120.50, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 2), 'Supermercado semana 1'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 1, 95.30, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 16), 'Supermercado semana 3'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 2, 45.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 5), 'Gasolina'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 3, 750.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1), 'Renta departamento'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 1, 4, 25.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 10), 'Cine'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 2, 1, 150.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 3), 'Compra supermercado'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 2, 5, 80.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 12), 'Libro de programación'),
('GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 3, 6, 65.00, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 8), 'Consulta médica');


-- Insertar gastos de meses anteriores para pruebas de historial
INSERT INTO Gastos (Id_Gasto, Id_Usuario, Id_Categoria_Gasto, Monto, Fecha, Descripcion)
SELECT 
    'GAS' + RIGHT('0000000' + CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(7)), 7), 
    u.Id_Usuario, 
    cg.Id_Categoria_Gasto, 
    CASE 
        WHEN cg.Nombre_Categoria_Gasto = 'Vivienda' THEN 700.00 + (RAND() * 200)
        WHEN cg.Nombre_Categoria_Gasto = 'Alimentación' THEN 80.00 + (RAND() * 100)
        WHEN cg.Nombre_Categoria_Gasto = 'Transporte' THEN 30.00 + (RAND() * 50)
        ELSE 10.00 + (RAND() * 40)
    END,
    DATEADD(MONTH, -m.meses, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1 + CAST(RAND() * 28 AS INT))),
    'Gasto prueba ' + cg.Nombre_Categoria_Gasto + ' mes ' + CAST(m.meses AS VARCHAR(10))
FROM Usuarios u
CROSS JOIN (VALUES (1), (2), (3)) AS m(meses)
CROSS JOIN Categorias_Gastos cg
WHERE u.Id_Estado = 1 AND m.meses BETWEEN 1 AND 3;


-- Primero calculamos el total en una variable separada
DECLARE @TotalPresupuesto DECIMAL(10,2)
SELECT @TotalPresupuesto = SUM(Presupuesto_Mensual) FROM Categorias_Gastos
-- Declaramos la variable de tabla
DECLARE @DetallesPresupuestoGastos DetallePresupuestoType
-- Insertamos los datos
INSERT INTO @DetallesPresupuestoGastos (Id_Categoria, Monto_Asignado)
SELECT Id_Categoria_Gasto, Presupuesto_Mensual FROM Categorias_Gastos
-- Ejecutamos el procedimiento con la variable calculada
EXEC POST_CrearPresupuesto 
    @IdUsuario = 1,
    @NombrePresupuesto = 'Presupuesto Mensual Gastos',
    @IdTipoPresupuesto = 1, -- Gasto
    @IdPeriodo = 3, -- Mensual
    @MontoTotal = @TotalPresupuesto,
    @Objetivo = 'Controlar gastos mensuales',
    @DetallesPresupuesto = @DetallesPresupuestoGastos



-- Presupuesto de ingresos para usuario 1
DECLARE @TotalIngresos DECIMAL(10,2);
SELECT @TotalIngresos = SUM(Meta_Mensual) FROM Categorias_Ingresos;
DECLARE @DetallesPresupuestoIngresos DetallePresupuestoType;
INSERT INTO @DetallesPresupuestoIngresos (Id_Categoria, Monto_Asignado)
SELECT Id_Categoria_Ingreso, Meta_Mensual FROM Categorias_Ingresos;
EXEC POST_CrearPresupuesto 
    @IdUsuario = 1,
    @NombrePresupuesto = 'Presupuesto Mensual Ingresos',
    @IdTipoPresupuesto = 2, -- Ingreso
    @IdPeriodo = 3, -- Mensual
    @MontoTotal = @TotalIngresos,
    @Objetivo = 'Alcanzar metas de ingresos mensuales',
    @DetallesPresupuesto = @DetallesPresupuestoIngresos;


-- Presupuesto de ahorro para usuario 2
DECLARE @DetallesPresupuestoAhorro DetallePresupuestoType;
INSERT INTO @DetallesPresupuestoAhorro (Id_Categoria, Monto_Asignado)
SELECT Id_Categoria_Gasto, Presupuesto_Mensual FROM Categorias_Gastos WHERE Nombre_Categoria_Gasto = 'Ahorros';

EXEC POST_CrearPresupuesto 
    @IdUsuario = 2,
    @NombrePresupuesto = 'Ahorro Anual',
    @IdTipoPresupuesto = 3, -- Ahorro
    @IdPeriodo = 5, -- Anual
    @MontoTotal = 3600.00, -- 300 x 12 meses
    @Objetivo = 'Ahorrar para vacaciones',
    @DetallesPresupuesto = @DetallesPresupuestoAhorro;

	-- Insertar metas de ahorro
INSERT INTO Metas_Ahorro (Id_Usuario, Nombre_Meta, Monto_Objetivo, Fecha_Objetivo, Descripcion, Id_Estado)
VALUES 
(1, 'Computadora nueva', 1200.00, DATEADD(MONTH, 6, GETDATE()), 'Laptop para trabajo', 1),
(1, 'Fondo emergencia', 5000.00, DATEADD(YEAR, 1, GETDATE()), 'Ahorro para emergencias', 1),
(2, 'Viaje a Europa', 3000.00, DATEADD(MONTH, 9, GETDATE()), 'Ahorrar para viaje de verano', 1),
(3, 'Departamento nuevo', 15000.00, DATEADD(YEAR, 2, GETDATE()), 'Enganche para departamento', 1);

-- Insertar transacciones a metas de ahorro
INSERT INTO Transacciones_Ahorro (Id_Meta_Ahorro, Monto, Descripcion, Id_Estado)
VALUES 
(1, 200.00, 'Primer depósito', 1),
(1, 150.00, 'Ahorro quincenal', 1),
(2, 300.00, 'Fondo inicial', 1),
(3, 500.00, 'Primer ahorro viaje', 1),
(3, 200.00, 'Ahorro mes febrero', 1),
(4, 1000.00, 'Primer ahorro departamento', 1);

-- Actualizar montos acumulados en metas
UPDATE Metas_Ahorro
SET Monto_Acumulado = (
    SELECT COALESCE(SUM(Monto), 0)
    FROM Transacciones_Ahorro
    WHERE Id_Meta_Ahorro = Metas_Ahorro.Id_Meta_Ahorro
    AND Id_Estado = 1
)
WHERE Id_Estado = 1;

-- Insertar recordatorios
INSERT INTO Recordatorios (Id_Usuario, Id_Tipo_Recordatorio, Titulo, Descripcion, Fecha_Recordatorio, Repetir, Frecuencia, Id_Estado)
VALUES 
(1, 1, 'Pago de renta', 'Recordar pagar la renta del departamento', DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1), 1, 'Mensual', 1),
(1, 2, 'Revisar presupuesto', 'Revisar y ajustar presupuesto mensual', DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 28), 1, 'Mensual', 1),
(1, 4, 'Cumpleaños mamá', 'Comprar regalo para el cumpleaños', DATEFROMPARTS(YEAR(GETDATE()), 5, 15), 1, 'Anual', 1),
(2, 1, 'Pago tarjeta crédito', 'Pagar tarjeta antes de la fecha límite', DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 20), 1, 'Mensual', 1),
(3, 3, 'Depósito ahorro', 'Hacer depósito a cuenta de ahorros', DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 15), 1, 'Mensual', 1);

-- Insertar tips financieros
INSERT INTO Tips_Financieros (Titulo, Icono, Definicion, Porcentaje_Ingresos, Id_Impacto, Id_Flexibilidad, Id_Estado)
VALUES 
('Regla 50-30-20', 'percent', 'Distribuye tus ingresos: 50% necesidades, 30% deseos, 20% ahorros', 20, 1, 2, 1),
('Fondo de emergencia', 'shield', 'Mantén un fondo equivalente a 3-6 meses de gastos', 10, 1, 1, 1),
('Automatiza ahorros', 'refresh-cw', 'Configura transferencias automáticas a tu cuenta de ahorros', 15, 2, 2, 1),
('Revisa suscripciones', 'credit-card', 'Elimina suscripciones que no uses regularmente', 5, 3, 3, 1),
('Compara antes de comprar', 'search', 'Investiga precios y opciones antes de realizar compras grandes', 0, 2, 3, 1);

-- Insertar ejemplos para tips
INSERT INTO Ejemplos_Tips (Id_Tip, Nombre_Ejemplo, Descripcion, Consejo)
VALUES 
(1, 'Ejemplo Juan', 'Juan gana $2000 al mes. Gasta $1000 en necesidades, $600 en deseos y ahorra $400', 'Ajusta los porcentajes según tus prioridades'),
(2, 'Ejemplo María', 'María gasta $1500 al mes. Su fondo de emergencia es de $9000 (6 meses)', 'Empieza con un mes y ve aumentando gradualmente'),
(3, 'Ejemplo automatización', 'Carlos configura transferencia del 15% de su salario cada quincena', 'Empieza con un porcentaje pequeño si es necesario'),
(4, 'Ejemplo suscripciones', 'Ana revisó sus suscripciones y canceló 3 que no usaba, ahorrando $30/mes', 'Revisa cada 3 meses tus suscripciones');

-- Insertar secciones para tips
INSERT INTO Secciones_Tips (Id_Tip, Titulo_Seccion, Descripcion, Estadistica, Orden)
VALUES 
(1, 'Cómo implementar', 'Pasos para aplicar esta regla en tus finanzas', '80% de personas mejoran sus finanzas con esta regla', 1),
(1, 'Beneficios', 'Ventajas de seguir esta distribución', 'Reduce estrés financiero en un 60%', 2),
(2, 'Cómo calcular', 'Calcula tu fondo de emergencia ideal', 'Solo 40% de personas tienen fondo de emergencia', 1),
(3, 'Configuración', 'Cómo configurar transferencias automáticas', 'Ahorro automático aumenta constancia en 75%', 1);

-- Insertar items de sección
INSERT INTO Items_Seccion (Id_Seccion, Item, Orden)
VALUES 
(1, 'Calcula tus ingresos netos mensuales', 1),
(1, 'Identifica tus gastos esenciales (50%)', 2),
(1, 'Establece un límite para gastos discrecionales (30%)', 3),
(1, 'Automatiza el ahorro del 20%', 4),
(2, 'Mayor control sobre tus finanzas', 1),
(2, 'Reducción de deudas', 2),
(2, 'Paz mental al tener un plan', 3),
(3, 'Suma todos tus gastos mensuales esenciales', 1),
(3, 'Multiplica por 3 (mínimo) o 6 (ideal)', 2),
(4, 'Contacta a tu banco o usa su app móvil', 1),
(4, 'Programa transferencia para el día después de recibir tu salario', 2);

-- Insertar recursos para tips
INSERT INTO Recursos_Tips (Id_Tip, Id_Tipo_Recurso, Titulo, Url, Descripcion)
VALUES 
(1, 3, 'Video explicativo', 'https://youtube.com/regla50-30-20', 'Explicación detallada de la regla'),
(1, 1, 'Calculadora', 'https://ejemplo.com/calculadora503020', 'Calcula tus porcentajes fácilmente'),
(2, 2, 'Guía PDF', 'https://ejemplo.com/guia-fondo-emergencia.pdf', 'Guía completa para crear tu fondo'),
(3, 4, 'Herramienta automatización', 'https://ejemplo.com/automatiza-ahorros', 'Herramienta para configurar ahorros automáticos');

-- Ejecutar procedimiento para generar resumen mensual (esto creará datos adicionales internamente)
-- Primero calculamos los valores en variables
DECLARE @MesActual INT = MONTH(GETDATE());
DECLARE @AnioActual INT = YEAR(GETDATE());
-- Luego ejecutamos el procedimiento con las variables
EXEC GET_ObtenerResumenMensual 
    @IdUsuario = 1, 
    @Mes = @MesActual, 
    @Anio = @AnioActual;

-- Obtener tips para ver datos relacionados
EXEC GET_ObtenerTips;
EXEC GET_ObtenerDetalleTip @IdTip = 1;


SELECT * FROM Ingresos