<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode','1');
    session_set_cookie_params(['httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off','samesite'=>'Lax','path'=>'/']);
    session_start();
}
function exigir_admin(): void {
    if (empty($_SESSION['admin_id'])) { header('Location: login.php'); exit; }
}
function token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function validar_token(): void {
    if (!hash_equals(token(), (string)($_POST['csrf'] ?? ''))) {
        http_response_code(403); exit('Solicitud inválida (CSRF)');
    }
}
function h($texto): string { return htmlspecialchars((string)$texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
