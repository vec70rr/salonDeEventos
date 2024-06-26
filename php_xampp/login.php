<?php
session_start(); // Inicia una nueva sesión o reanuda la existente
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin,X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Content-Type: application/json");
require 'conexionBd.php'; // Incluye el script de conexión a la base de datos
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(array("error" => "Invalid JSON: " . json_last_error_msg()));
        exit;
    }
    
    $u = $data["username"];
    $p = $data["password"];
    $username = $conn->real_escape_string($u);
    $password = $conn->real_escape_string($p);

    // Preparar la consulta
    $stmt = $conn->prepare("SELECT password FROM Cliente WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Verificar la contraseña
        if (password_verify($password, $row['password'])) {
            $_SESSION['username'] = $username; // Almacenar el nombre de usuario en la sesión
            echo "Inicio correcto";
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

