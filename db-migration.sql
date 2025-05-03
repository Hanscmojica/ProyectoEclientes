-- Seleccionar la base de datos
USE test_db;

-- Crear tabla de registro de consultas
CREATE TABLE IF NOT EXISTS BP_06_REGISTRO_CONSULTA (
  nId06RegistroConsulta INT AUTO_INCREMENT PRIMARY KEY,
  nId01Usuario INT NOT NULL,
  sFolioReferencia VARCHAR(255) NOT NULL,
  sDetalleConsulta TEXT NULL,
  sTipoConsulta VARCHAR(50) NOT NULL,
  bExito BOOLEAN DEFAULT TRUE,
  sError TEXT NULL,
  dFechaConsulta DATETIME DEFAULT CURRENT_TIMESTAMP,
  sIpUsuario VARCHAR(50) NULL,
  FOREIGN KEY (nId01Usuario) REFERENCES BP_01_USUARIO(nId01Usuario)
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_registro_consulta_usuario ON BP_06_REGISTRO_CONSULTA(nId01Usuario);
CREATE INDEX idx_registro_consulta_fecha ON BP_06_REGISTRO_CONSULTA(dFechaConsulta);
CREATE INDEX idx_registro_consulta_tipo ON BP_06_REGISTRO_CONSULTA(sTipoConsulta);

-- Comentario: Este script crea la tabla BP_06_REGISTRO_CONSULTA y sus índices.
-- Debe ejecutarse en MySQL Workbench contra la base de datos del proyecto. 