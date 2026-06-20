<?php
/**
 * RAÍCES TICKETS — Controlador de Autenticación
 * Archivo: controlador/ControladorAuth.php
 *
 * En el prototipo actual la lógica reside en el frontend (autenticacion.js).
 * Este archivo es el stub PHP listo para conectar con la base de datos Oracle/MySQL
 * cuando el sistema pase a producción.
 *
 * Estructura MVC:
 *   Vista     → vista/modulos/login.html / registro.html / menu.html
 *   Modelo    → modelo/ModeloUsuario.php  (a implementar)
 *   Controlador → este archivo
 */

// ─────────────────────────────────────────────
// Configuración de conexión a base de datos
// ─────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'folklore2026');
define('DB_USER', 'root');
define('DB_PASS', '');

/**
 * Devuelve una conexión PDO a la base de datos.
 * Lanza excepción si no se puede conectar.
 */
function obtenerConexion(): PDO {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

// ─────────────────────────────────────────────
// Respuesta JSON helper
// ─────────────────────────────────────────────
function respuestaJSON(bool $exito, string $mensaje, array $datos = []): void {
    header('Content-Type: application/json');
    echo json_encode([
        'exito'   => $exito,
        'mensaje' => $mensaje,
        'datos'   => $datos,
    ]);
    exit;
}

// ─────────────────────────────────────────────
// Router de acciones
// ─────────────────────────────────────────────
$accion = $_POST['accion'] ?? $_GET['accion'] ?? '';

match ($accion) {
    'login'    => accionLogin(),
    'registro' => accionRegistro(),
    'logout'   => accionLogout(),
    default    => respuestaJSON(false, 'Acción no reconocida.')
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function accionLogin(): void {
    $email    = trim($_POST['email']    ?? '');
    $password =      $_POST['password'] ?? '';

    if (!$email || !$password) {
        respuestaJSON(false, 'Faltan campos obligatorios.');
    }

    // TODO: reemplazar con consulta real a la BD
    /*
    $pdo  = obtenerConexion();
    $stmt = $pdo->prepare('
        SELECT id, nombre, email, password_hash, rol
        FROM usuarios
        WHERE email = :email AND activo = 1
        LIMIT 1
    ');
    $stmt->execute([':email' => $email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
        respuestaJSON(false, 'Credenciales incorrectas.');
    }

    session_start();
    $_SESSION['usuario'] = [
        'id'     => $usuario['id'],
        'nombre' => $usuario['nombre'],
        'email'  => $usuario['email'],
        'rol'    => $usuario['rol'],
    ];
    respuestaJSON(true, 'Login exitoso.', $_SESSION['usuario']);
    */

    // Stub para prototipo
    respuestaJSON(true, 'Login simulado (stub).', ['email' => $email]);
}

// ─────────────────────────────────────────────
// REGISTRO
// ─────────────────────────────────────────────
function accionRegistro(): void {
    $nombre   = trim($_POST['nombre']   ?? '');
    $dni      = trim($_POST['dni']      ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $email    = trim($_POST['email']    ?? '');
    $password =      $_POST['password'] ?? '';

    // Validaciones básicas del servidor
    if (!$nombre || !$dni || !$email || !$password) {
        respuestaJSON(false, 'Faltan campos obligatorios.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respuestaJSON(false, 'Correo electrónico inválido.');
    }
    if (!preg_match('/^\d{7,8}$/', $dni)) {
        respuestaJSON(false, 'DNI inválido.');
    }
    if (strlen($password) < 8) {
        respuestaJSON(false, 'La contraseña debe tener al menos 8 caracteres.');
    }

    // TODO: guardar en BD
    /*
    $pdo = obtenerConexion();

    // Verificar email único
    $check = $pdo->prepare('SELECT id FROM usuarios WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        respuestaJSON(false, 'El correo ya está registrado.');
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $ins  = $pdo->prepare('
        INSERT INTO usuarios (nombre, dni, telefono, email, password_hash, rol, activo)
        VALUES (:nombre, :dni, :telefono, :email, :hash, "usuario", 1)
    ');
    $ins->execute([
        ':nombre'   => $nombre,
        ':dni'      => $dni,
        ':telefono' => $telefono,
        ':email'    => $email,
        ':hash'     => $hash,
    ]);
    $idNuevo = $pdo->lastInsertId();

    session_start();
    $_SESSION['usuario'] = ['id' => $idNuevo, 'nombre' => $nombre, 'email' => $email, 'rol' => 'usuario'];
    respuestaJSON(true, 'Registro exitoso.', $_SESSION['usuario']);
    */

    // Stub para prototipo
    respuestaJSON(true, 'Registro simulado (stub).', ['nombre' => $nombre, 'email' => $email]);
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
function accionLogout(): void {
    session_start();
    session_destroy();
    respuestaJSON(true, 'Sesión cerrada.');
}
