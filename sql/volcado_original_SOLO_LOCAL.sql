-- StudyAI | Estructura de la base de datos
-- MySQL 8 / MariaDB 10.4+ | Codificacion UTF-8
CREATE DATABASE IF NOT EXISTS studyai
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studyai;

-- Eliminar primero las tablas dependientes para facilitar las pruebas.
DROP TABLE IF EXISTS progreso;
DROP TABLE IF EXISTS actividades;
DROP TABLE IF EXISTS lecciones;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alias VARCHAR(50) NOT NULL UNIQUE,
  tipo_usuario ENUM('alumno','docente') NOT NULL DEFAULT 'alumno',
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE materias (
  id_materia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE lecciones (
  id_leccion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_materia INT UNSIGNED NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  contenido TEXT NOT NULL,
  nivel TINYINT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_leccion_materia FOREIGN KEY (id_materia)
    REFERENCES materias(id_materia) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_nivel CHECK (nivel BETWEEN 1 AND 6)
) ENGINE=InnoDB;

CREATE TABLE actividades (
  id_actividad INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_leccion INT UNSIGNED NOT NULL,
  pregunta VARCHAR(255) NOT NULL,
  respuesta_correcta VARCHAR(150) NOT NULL,
  puntos TINYINT UNSIGNED NOT NULL DEFAULT 10,
  CONSTRAINT fk_actividad_leccion FOREIGN KEY (id_leccion)
    REFERENCES lecciones(id_leccion) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT chk_puntos CHECK (puntos BETWEEN 1 AND 100)
) ENGINE=InnoDB;

CREATE TABLE progreso (
  id_progreso INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  id_actividad INT UNSIGNED NOT NULL,
  completada BOOLEAN NOT NULL DEFAULT FALSE,
  puntos_obtenidos TINYINT UNSIGNED NOT NULL DEFAULT 0,
  fecha_ultimo_intento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuario_actividad UNIQUE (id_usuario, id_actividad),
  CONSTRAINT fk_progreso_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_progreso_actividad FOREIGN KEY (id_actividad)
    REFERENCES actividades(id_actividad) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT chk_puntos_obtenidos CHECK (puntos_obtenidos BETWEEN 0 AND 100)
) ENGINE=InnoDB;
-- StudyAI | Datos de ejemplo. Ejecutar despues de estructura_studyai.sql.
USE studyai;

INSERT INTO usuarios (id_usuario, alias, tipo_usuario) VALUES
(1, 'ExploradorAzul', 'alumno'),
(2, 'EstrellaMatematica', 'alumno'),
(3, 'ProfeDemo', 'docente');

INSERT INTO materias (id_materia, nombre, descripcion) VALUES
(1, 'Español', 'Lectura, escritura y lenguaje para primaria'),
(2, 'Matemáticas', 'Operaciones y razonamiento matemático para primaria');

INSERT INTO lecciones (id_leccion, id_materia, titulo, contenido, nivel) VALUES
(1, 1, 'Las vocales', 'Identifica las vocales A, E, I, O, U.', 1),
(2, 1, 'Sinónimos', 'Aprende palabras que tienen significados parecidos.', 3),
(3, 2, 'Sumas básicas', 'Practica sumas sencillas de números naturales.', 1),
(4, 2, 'Multiplicaciones', 'Resuelve multiplicaciones de una cifra.', 3);

INSERT INTO actividades (id_actividad, id_leccion, pregunta, respuesta_correcta, puntos) VALUES
(1, 1, '¿Cuál de estas letras es una vocal: B, A o T?', 'A', 10),
(2, 1, '¿Cuántas vocales tiene el español?', '5', 10),
(3, 2, 'Escribe un sinónimo de feliz.', 'contento', 10),
(4, 2, 'Escribe un sinónimo de rápido.', 'veloz', 10),
(5, 3, '¿Cuánto es 3 + 4?', '7', 10),
(6, 3, '¿Cuánto es 8 + 2?', '10', 10),
(7, 4, '¿Cuánto es 3 × 5?', '15', 10),
(8, 4, '¿Cuánto es 4 × 6?', '24', 10);

INSERT INTO progreso (id_progreso, id_usuario, id_actividad, completada, puntos_obtenidos) VALUES
(1, 1, 1, TRUE, 10),
(2, 1, 5, TRUE, 10),
(3, 1, 6, FALSE, 0),
(4, 2, 2, TRUE, 10),
(5, 2, 7, TRUE, 10),
(6, 2, 8, FALSE, 0);
