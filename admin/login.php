<?php
require __DIR__ . '/_auth.php';
require __DIR__ . '/../config/conexion.php';
if (!empty($_SESSION['admin_id'])) { header('Location: index.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    validar_token();
    $usuario = trim((string)($_POST['usuario'] ?? ''));
    $clave = (string)($_POST['clave'] ?? '');
    if (($_SESSION['bloqueo_hasta'] ?? 0) > time()) { $error='Demasiados intentos. Inténtalo más tarde.'; }
    elseif (strlen($usuario)>60 || strlen($clave)>1024) { $error='Datos inválidos'; }
    else {
        try {
            $stmt = bd()->prepare('SELECT id_admin,password_hash FROM administradores WHERE usuario=?');
            $stmt->execute([$usuario]);
            $admin=$stmt->fetch();
            if ($admin && password_verify($clave,$admin['password_hash'])) {
                unset($_SESSION['fallos_login'], $_SESSION['bloqueo_hasta']);
                session_regenerate_id(true);
                $_SESSION['admin_id'] = (int)$admin['id_admin'];
                $_SESSION['usuario'] = $usuario;
                header('Location: index.php'); exit;
            }
            $_SESSION['fallos_login'] = (int)($_SESSION['fallos_login'] ?? 0) + 1;
            if ($_SESSION['fallos_login'] >= 5) { $_SESSION['bloqueo_hasta'] = time() + 900; $_SESSION['fallos_login']=0; }
            $error='Usuario o contraseña incorrectos';
        } catch (Throwable $e) { $error='No se pudo iniciar sesión'; }
    }
}
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Administrador | StudyAI</title><link rel="stylesheet" href="../css/backend.css"></head>
<body><main class="card narrow"><a href="../index.html">← Volver a StudyAI</a><h1>🔐 Administrador</h1><p>Solo para personal autorizado.</p>
<?php if($error): ?><p class="error" role="alert"><?=h($error)?></p><?php endif; ?>
<form method="post"><input type="hidden" name="csrf" value="<?=h(token())?>"><label>Usuario<input type="text" name="usuario" maxlength="60" required autocomplete="username"></label><label>Contraseña<input type="password" name="clave" required autocomplete="current-password"></label><button>Ingresar</button></form></main></body></html>
