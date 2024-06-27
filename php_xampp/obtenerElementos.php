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
    
    $id_evento = $data["id"];



    $stmt = $conn->prepare("SELECT * FROM mesa WHERE id_evento = ?");
    $stmt->bind_param("i", $id_evento);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result){
        $mesas = array();
        while ($row = $result->fetch_assoc()) {
            $mesas[] = $row;
        }
        $stmt = $conn->prepare("SELECT * FROM elemento natural join tipoelemento WHERE id_evento = ?");
        $stmt->bind_param("i", $id_evento);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result){
            $elementos = array();
            while ($row = $result->fetch_assoc()) {
                $elementos[] = $row;
            }
            echo json_encode(array("success" => true, "mesas" => $mesas, "elementos" => $elementos));
        }
    }
        



    $stmt->close();
    $conn->close();
}
?>

