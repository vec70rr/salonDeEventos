<?php
session_start(); // Inicia una nueva sesión o reanuda la existente
require 'conexionBd.php'; // Incluye el script de conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Preparar la consulta
    $stmt = $conn->prepare("SELECT password FROM Usuarios WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Verificar la contraseña
        if (password_verify($password, $row['password'])) {
            $_SESSION['username'] = $username; // Almacenar el nombre de usuario en la sesión
            header("Location: create_event.html"); // Redirige a la página de creación de eventos
            exit();
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "Usuario no encontrado.";
    }
    $stmt->close();
    $conn->close();
}
?>

