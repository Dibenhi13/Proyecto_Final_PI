-- Ejecuta UNA SOLA VEZ sobre la base de datos StudyAI existente.
-- Antes de ejecutarlo: Exportar > SQL en phpMyAdmin (respaldo).
-- Conserva todas las tablas, registros, lecciones y actividades.
USE studyai;
ALTER TABLE usuarios
  ADD COLUMN token_acceso CHAR(64) NULL UNIQUE AFTER alias;
-- El token original nunca se almacena en MySQL, solo su SHA-256.
-- La tabla progreso existente ya tiene id_usuario/id_actividad UNIQUE.
