<?php
require __DIR__ . '/_base.php';
metodo('GET');
try {
    $materias = bd()->query('SELECT id_materia,nombre,descripcion FROM materias ORDER BY id_materia')->fetchAll();
    json_salida(['materias'=>$materias]);
} catch (Throwable $e) { json_salida(['error'=>'No se pudieron cargar las materias'],500); }
