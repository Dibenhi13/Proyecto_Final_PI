<?php
// Modifica estos valores para tu instalación. NUNCA incluyas este archivo en HTML/JS.
// XAMPP: localhost, root, contraseña vacía. En hosting consulta sus credenciales MySQL.
const DB_HOST = 'localhost';
const DB_NAME = 'studyai';
const DB_USER = 'root';
const DB_PASS = '';

function bd(): PDO {
    static $conexion = null;
    if ($conexion === null) {
        $conexion = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
             PDO::ATTR_EMULATE_PREPARES => false]
        );
    }
    return $conexion;
}
