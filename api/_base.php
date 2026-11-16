<?php
require_once __DIR__ . '/../config/conexion.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function json_salida($valor, int $codigo = 200): void {
    http_response_code($codigo);
    echo json_encode($valor, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function metodo(string $esperado): void {
    if ($_SERVER['REQUEST_METHOD'] !== $esperado) {
        header('Allow: ' . $esperado);
        json_salida(['error' => 'Método no permitido'], 405);
    }
}
function entero_id($valor): int {
    $id = filter_var($valor, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]);
    if ($id === false) json_salida(['error'=>'Identificador inválido'],400);
    return (int)$id;
}
