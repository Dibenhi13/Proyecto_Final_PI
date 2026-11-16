<?php
// Solo desde terminal: php config/crear_admin.php nombre_usuario
// Lee la contraseña sin incluirla en la línea de comandos.
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Acceso denegado'); }
require __DIR__ . '/conexion.php';
$usuario = $argv[1] ?? '';
if (!preg_match('/^[a-zA-Z0-9_]{4,60}$/', $usuario)) {
    exit("Uso: php config/crear_admin.php adminStudyAI\nEl usuario debe tener 4-60 caracteres alfanuméricos o _.\n");
}
echo "Contraseña nueva (mínimo 12 caracteres): ";
$clave = rtrim(fgets(STDIN), "\r\n");
if (strlen($clave) < 12) exit("La contraseña es demasiado corta.\n");
$hash = password_hash($clave, PASSWORD_DEFAULT);
$stmt = bd()->prepare('INSERT INTO administradores (usuario,password_hash) VALUES (?,?)');
try {
    $stmt->execute([$usuario,$hash]);
    echo "Administrador creado. Exporta la tabla administradores antes de subir a hosting.\n";
} catch (PDOException $e) {
    exit("No se pudo crear: comprueba que el usuario no exista y que importaste actualizacion.sql.\n");
}
