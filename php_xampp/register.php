<?php
require 'conexionBd.php';
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin,X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Content-Type: application/json");

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

    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT nombre_usuario FROM Cliente WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo "Ya existe un usuario con ese nombre";
    }
    else{
        // Preparar y ejecutar la consulta
        $stmt = $conn->prepare("INSERT INTO Cliente (nombre_usuario, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $passwordHash);
        if ($stmt->execute()) {
            echo "Usuario registrado con exito";
        } else {
            echo "Error: " . $stmt->error;
        }
}
   

    
    $stmt->close();
    $conn->close();
}
?>
