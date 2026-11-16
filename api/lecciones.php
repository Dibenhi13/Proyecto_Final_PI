<?php
require __DIR__ . '/_base.php';
metodo('GET');
try {
    if (isset($_GET['materia'])) {
        $id = entero_id($_GET['materia']);
        $stmt = bd()->prepare('SELECT id_leccion,id_materia,titulo,contenido,explicacion,ejemplo,nivel FROM lecciones WHERE id_materia=? ORDER BY nivel,id_leccion');
        $stmt->execute([$id]);
        $datos = $stmt->fetchAll();
    } else {
        $datos = bd()->query('SELECT id_leccion,id_materia,titulo,contenido,explicacion,ejemplo,nivel FROM lecciones ORDER BY nivel,id_leccion')->fetchAll();
    }
    json_salida(['lecciones'=>$datos]);
} catch (Throwable $e) { json_salida(['error'=>'No se pudieron cargar las lecciones'],500); }
