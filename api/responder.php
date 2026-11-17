<?php
require __DIR__ . '/_estudiante.php';
metodo('POST');
// Evita solicitudes cross-site con POST JSON (además del SameSite cookie).
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen !== '') {
    $destino = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? '');
    if (!hash_equals($destino, $origen)) json_salida(['error'=>'Origen no permitido'],403);
}
$entrada = json_decode(file_get_contents('php://input'), true);
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
    $normalizar = static function($texto) {
        $texto = trim($texto);
        return function_exists('mb_strtolower') ? mb_strtolower($texto,'UTF-8') : strtolower($texto);
    };
    $acierto = $normalizar($respuesta) === $normalizar($actividad['respuesta_correcta']);
    $puntos = $acierto ? (int)$actividad['puntos'] : 0;
    $estudiante = id_visitante(true);
    // Conserva el mejor resultado de cada ejercicio (evita contar puntos dos veces).
    $consulta = bd()->prepare('INSERT INTO progreso (id_usuario,id_actividad,completada,puntos_obtenidos) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE completada=GREATEST(completada, VALUES(completada)), puntos_obtenidos=GREATEST(puntos_obtenidos, VALUES(puntos_obtenidos)), fecha_ultimo_intento=CURRENT_TIMESTAMP');
    $consulta->execute([$estudiante,$id,(int)$acierto,$puntos]);
    json_salida(['correcta'=>$acierto,'puntos_obtenidos'=>$puntos,'guardado'=>true]);
} catch (Throwable $e) {
    error_log('StudyAI responder: ' . $e->getMessage());
    json_salida(['error'=>'No se pudo comprobar o guardar la respuesta'],500);
}
