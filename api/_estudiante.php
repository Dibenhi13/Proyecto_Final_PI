<?php
// Identificador seudónimo persistente por navegador (30 días).
require_once __DIR__ . '/_base.php';
const COOKIE_ESTUDIANTE = 'studyai_visitante';
function token_visitante(): ?string {
    $token = $_COOKIE[COOKIE_ESTUDIANTE] ?? null;
    return is_string($token) && preg_match('/^[a-f0-9]{64}$/D', $token) ? $token : null;
}
function id_visitante(bool $crear = false): ?int {
    $token = token_visitante();
    if ($token !== null) {
        $consulta = bd()->prepare('SELECT id_usuario FROM usuarios WHERE token_acceso=? LIMIT 1');
        $consulta->execute([hash('sha256', $token)]);
        $id = $consulta->fetchColumn();
        if ($id !== false) return (int) $id;
    }
    if (!$crear) return null;
    $token = bin2hex(random_bytes(32));
    $alias = 'visitante_' . bin2hex(random_bytes(12));
    $consulta = bd()->prepare("INSERT INTO usuarios (alias,tipo_usuario,token_acceso) VALUES (?,'alumno',?)");
    $consulta->execute([$alias, hash('sha256', $token)]);
    // El token NO se muestra en pantalla ni en la respuesta JSON.
    setcookie(COOKIE_ESTUDIANTE, $token, [
        'expires'=>time()+60*60*24*30,
        'path'=>'/',
        'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly'=>true,
        'samesite'=>'Lax'
    ]);
    return (int)bd()->lastInsertId();
}
