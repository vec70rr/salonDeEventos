<?php
require 'conexionBd.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST['username']);
    $password = $conn->real_escape_string($_POST['password']);

    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("INSERT INTO Usuarios (nombre_usuario, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $passwordHash);
    if ($stmt->execute()) {
        echo "Usuario registrado con éxito.";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
    $conn->close();
}
?>
