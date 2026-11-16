<?php
require __DIR__ . '/_base.php';
metodo('GET');
if (!isset($_GET['leccion'])) json_salida(['error'=>'Falta leccion'],400);
$id = entero_id($_GET['leccion']);
try {
    // No enviamos la respuesta correcta al navegador.
    $stmt = bd()->prepare('SELECT id_actividad,id_leccion,pregunta,puntos FROM actividades WHERE id_leccion=? ORDER BY id_actividad');
    $stmt->execute([$id]);
    json_salida(['actividades'=>$stmt->fetchAll()]);
} catch (Throwable $e) { json_salida(['error'=>'No se pudieron cargar las actividades'],500); }
