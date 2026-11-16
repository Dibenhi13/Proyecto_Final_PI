-- EJECUTAR DESPUÉS del volcado original de StudyAI.
-- No elimina ni modifica las cinco tablas existentes.
-- Si la base fue seleccionada en phpMyAdmin, no es necesario USE studyai;
CREATE TABLE IF NOT EXISTS administradores (
 id_admin INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 usuario VARCHAR(60) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
