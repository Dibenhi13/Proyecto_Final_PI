# Diccionario de datos — StudyAI

**Gestor:** MySQL 8 / MariaDB 10.4+  
**Base de datos:** `studyai`  
**Objetivo:** almacenar usuarios identificados por alias, materias, lecciones, actividades y avances en la plataforma educativa StudyAI.

## Tabla `usuarios`
Almacena perfiles de prueba sin nombres reales, correos personales ni ubicación.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id_usuario` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador único del usuario. |
| `alias` | VARCHAR(50) | NOT NULL, UNIQUE | Nombre visible o seudónimo. |
| `tipo_usuario` | ENUM('alumno','docente') | NOT NULL, DEFAULT 'alumno' | Tipo de perfil. |
| `fecha_registro` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Fecha de creación. |

## Tabla `materias`
Almacena las asignaturas que ofrece StudyAI.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id_materia` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador de la materia. |
| `nombre` | VARCHAR(50) | NOT NULL, UNIQUE | Nombre de la materia. |
| `descripcion` | VARCHAR(255) | NULL | Breve explicación de su contenido. |

## Tabla `lecciones`
Cada lección pertenece a una sola materia.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id_leccion` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador de la lección. |
| `id_materia` | INT UNSIGNED | FK → materias.id_materia, NOT NULL | Materia a la que pertenece. |
| `titulo` | VARCHAR(100) | NOT NULL | Título de la lección. |
| `contenido` | TEXT | NOT NULL | Explicación de la lección. |
| `nivel` | TINYINT UNSIGNED | NOT NULL, 1–6, DEFAULT 1 | Grado o nivel sugerido de primaria. |

## Tabla `actividades`
Cada actividad corresponde a una lección.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id_actividad` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador de la actividad. |
| `id_leccion` | INT UNSIGNED | FK → lecciones.id_leccion, NOT NULL | Lección que contiene la actividad. |
| `pregunta` | VARCHAR(255) | NOT NULL | Enunciado del ejercicio. |
| `respuesta_correcta` | VARCHAR(150) | NOT NULL | Respuesta prevista para comparar resultados. |
| `puntos` | TINYINT UNSIGNED | NOT NULL, 1–100, DEFAULT 10 | Puntuación máxima de la actividad. |

## Tabla `progreso`
Registra el estado y la puntuación de una actividad para cada usuario. En esta versión se conserva solo el último estado de cada combinación usuario–actividad.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id_progreso` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador del registro. |
| `id_usuario` | INT UNSIGNED | FK → usuarios.id_usuario, NOT NULL | Usuario que realizó la actividad. |
| `id_actividad` | INT UNSIGNED | FK → actividades.id_actividad, NOT NULL | Actividad evaluada. |
| `completada` | BOOLEAN | NOT NULL, DEFAULT FALSE | Indica si la actividad está finalizada. |
| `puntos_obtenidos` | TINYINT UNSIGNED | NOT NULL, 0–100, DEFAULT 0 | Puntuación del último intento registrado. |
| `fecha_ultimo_intento` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Fecha de actualización del progreso. |

**Regla de unicidad:** `UNIQUE(id_usuario, id_actividad)` evita duplicar el progreso de una misma actividad para un mismo usuario.

## Relaciones

- `materias` 1 → N `lecciones`.
- `lecciones` 1 → N `actividades`.
- `usuarios` 1 → N `progreso`.
- `actividades` 1 → N `progreso`.
- Por medio de `progreso`, `usuarios` y `actividades` tienen una relación N ↔ M.

## Alcance

Las páginas de **geolocalización** y **contacto** no almacenan información en esta versión: la primera consulta la ubicación en el navegador; la segunda abre un correo con `mailto:`. El módulo de IA y la autenticación real podrán desarrollarse posteriormente. Los registros del archivo de ejemplo son ficticios.
