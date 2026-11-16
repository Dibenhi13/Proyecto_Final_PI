<?php
require __DIR__ . '/_base.php';
metodo('POST');
$entrada = json_decode(file_get_contents('php://input'),true);
if (!is_array($entrada) || !isset($entrada['id_actividad']) || !is_string($entrada['respuesta'] ?? null)) {
    json_salida(['error'=>'Solicitud inválida'],400);
}
$id = entero_id($entrada['id_actividad']);
$respuesta = trim($entrada['respuesta']);
if ($respuesta === '' || strlen($respuesta)>150) json_salida(['error'=>'Respuesta inválida'],400);
try {
    $stmt = bd()->prepare('SELECT respuesta_correcta,puntos FROM actividades WHERE id_actividad=?');
    $stmt->execute([$id]);
    $actividad = $stmt->fetch();
    if (!$actividad) json_salida(['error'=>'Actividad no encontrada'],404);
    $normalizar = function($texto) {
        $texto = trim($texto);
        return function_exists('mb_strtolower') ? mb_strtolower($texto,'UTF-8') : strtolower($texto);
    };
    $acierto = $normalizar($respuesta) === $normalizar($actividad['respuesta_correcta']);
    json_salida(['correcta'=>$acierto, 'puntos_obtenidos'=>$acierto ? (int)$actividad['puntos'] : 0]);
} catch (Throwable $e) { json_salida(['error'=>'No se pudo verificar la respuesta'],500); }
