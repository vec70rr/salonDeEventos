<?php
$host = "localhost"; // o la IP del servidor de bases de datos
$username = "usuario";
$password = "contraseña";
$database = "nombre_bd";

// Crear conexión
$conn = new mysqli($host, $username, $password, $database);

// Checar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
