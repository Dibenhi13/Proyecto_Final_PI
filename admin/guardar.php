<?php
require __DIR__ . '/_auth.php'; exigir_admin();
require __DIR__ . '/../config/conexion.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Método no permitido'); }
validar_token();
$tipo = (string)($_POST['tipo']??'');
try {
    if ($tipo === 'leccion') {
        $materia=filter_var($_POST['materia']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
        $nivel=filter_var($_POST['nivel']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1,'max_range'=>6]]);
        $titulo=trim((string)($_POST['titulo']??'')); $contenido=trim((string)($_POST['contenido']??''));
        $explicacion=trim((string)($_POST['explicacion']??'')); $ejemplo=trim((string)($_POST['ejemplo']??''));
        if (!$materia||!$nivel||$titulo===''||$contenido===''||strlen($titulo)>100||$explicacion===''||$ejemplo===''||strlen($contenido)>5000||strlen($explicacion)>10000||strlen($ejemplo)>5000) throw new Exception('Inválido');
        $stmt=bd()->prepare('INSERT INTO lecciones (id_materia,titulo,contenido,explicacion,ejemplo,nivel) VALUES (?,?,?,?,?,?)');
        $stmt->execute([$materia,$titulo,$contenido,$explicacion,$ejemplo,$nivel]);
    } elseif ($tipo === 'actividad') {
        $leccion=filter_var($_POST['leccion']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
        $puntos=filter_var($_POST['puntos']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1,'max_range'=>100]]);
        $pregunta=trim((string)($_POST['pregunta']??'')); $respuesta=trim((string)($_POST['respuesta']??''));
        if (!$leccion||!$puntos||$pregunta===''||$respuesta===''||strlen($pregunta)>255||strlen($respuesta)>150) throw new Exception('Inválido');
        $stmt=bd()->prepare('INSERT INTO actividades (id_leccion,pregunta,respuesta_correcta,puntos) VALUES (?,?,?,?)');
        $stmt->execute([$leccion,$pregunta,$respuesta,$puntos]);
    } elseif ($tipo === 'borrar_leccion' || $tipo === 'borrar_actividad') {
        $id=filter_var($_POST['id']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
        if (!$id) throw new Exception('Inválido');
        $tabla=$tipo==='borrar_leccion'?'lecciones':'actividades';
        $campo=$tipo==='borrar_leccion'?'id_leccion':'id_actividad';
        $stmt=bd()->prepare("DELETE FROM $tabla WHERE $campo=?");
        $stmt->execute([$id]);
    } else throw new Exception('Operación inválida');
    header('Location: index.php?estado=ok'); exit;
} catch(Throwable $e) { header('Location: index.php?estado=error'); exit; }
