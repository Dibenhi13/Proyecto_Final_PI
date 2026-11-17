<?php
require __DIR__ . '/_estudiante.php';
metodo('GET');
try {
    $id = id_visitante();
    if ($id === null) json_salida(['lecciones'=>[], 'puntos_totales'=>0, 'aciertos_totales'=>0]);
    $consulta = bd()->prepare('SELECT a.id_leccion, COUNT(*) AS intentadas, SUM(CASE WHEN p.completada=1 THEN 1 ELSE 0 END) AS aciertos, SUM(p.puntos_obtenidos) AS puntos, (SELECT COUNT(*) FROM actividades a2 WHERE a2.id_leccion=a.id_leccion) AS total FROM progreso p JOIN actividades a ON a.id_actividad=p.id_actividad WHERE p.id_usuario=? GROUP BY a.id_leccion');
    $consulta->execute([$id]);
    $lecciones = $consulta->fetchAll();
    $puntos = 0; $aciertos = 0;
    foreach ($lecciones as &$leccion) {
        foreach (['id_leccion','intentadas','aciertos','puntos','total'] as $col) $leccion[$col] = (int)$leccion[$col];
        $leccion['completada'] = $leccion['total'] > 0 && $leccion['aciertos'] === $leccion['total'];
        $puntos += $leccion['puntos']; $aciertos += $leccion['aciertos'];
    }
    json_salida(['lecciones'=>$lecciones, 'puntos_totales'=>$puntos, 'aciertos_totales'=>$aciertos]);
} catch (Throwable $e) {
    error_log('StudyAI progreso: '.$e->getMessage());
    json_salida(['error'=>'No se pudo cargar el progreso'],500);
}
