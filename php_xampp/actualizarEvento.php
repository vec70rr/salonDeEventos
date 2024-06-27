<?php
session_start();
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
    
    $id_evento = $data["id_evento"];
    $hora = $data["hora"];
    $fecha = $data["fecha"];
    $tipoE = $data["tipoE"];



    // Hash de la contraseña


    $stmt = $conn->prepare("UPDATE `saloneventos`.`evento` SET `fecha` = ?, `hora` = ?, `id_tipoevento` = ? WHERE (`id_evento` = ?);");
    $stmt->bind_param("ssii", $fecha, $hora, $tipoE, $id_evento);
    if ($stmt->execute()) {
        echo "Evento actualizado con exito";
    } else {
        echo "Error: " . $stmt->error;
    }

   

    
    $stmt->close();
    $conn->close();
}
?>
