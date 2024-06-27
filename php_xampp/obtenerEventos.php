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
    
    $username = $data["usuario"];


    $stmt = $conn->prepare("SELECT id_cliente FROM Cliente WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $id_cliente = $result->fetch_assoc()["id_cliente"];
        $stmt = $conn->prepare("SELECT * FROM evento natural join tipoevento WHERE id_cliente = ?");
        $stmt->bind_param("i", $id_cliente);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result){
            $dataArray = array();
            while ($row = $result->fetch_assoc()) {
                $dataArray[] = $row;
            }
            echo json_encode(array("success" => true, "dataArray" => $dataArray));
        }
        
    }
    else{
        echo "No se encontro al cliente";
    }


    $stmt->close();
    $conn->close();
}
?>

