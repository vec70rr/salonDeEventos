<?php
$host = "localhost"; // o la IP del servidor de bases de datos
$username = "root";
$password = "";
$database = "saloneventos";

// Crear conexión
$conn = new mysqli($host, $username, $password, $database);

// Checar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
