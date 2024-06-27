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
    
    $username = $data["usuario"];
    $hora = $data["hora"];
    $fecha = $data["fecha"];
    $tipoE = $data["tipoE"];
    $elementos = $data["elementos"];


    // Hash de la contraseña


    $stmt = $conn->prepare("SELECT id_cliente FROM Cliente WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $id_cliente = $result->fetch_assoc()["id_cliente"];

        $stmt = $conn->prepare("INSERT INTO `saloneventos`.`evento` (`id_cliente`, `fecha`, `hora`, `id_tipoevento`) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issi", $id_cliente, $fecha, $hora, $tipoE);
        if ($stmt->execute()) {
            $last_id = $conn->insert_id;
            foreach ($elementos as $elemento) {
                if($elemento["tipo"] == "Mesa"){
                    $stmt = $conn->prepare("INSERT INTO `saloneventos`.`mesa` (`id_evento`, `posx`, `posy`) VALUES (?, ?, ?)");
                    $stmt->bind_param("iii", $last_id, $elemento["posx"], $elemento["posy"]);
                    $stmt->execute();
                }
                else{
                    $stmt = $conn->prepare("SELECT id_tipoelemento FROM tipoelemento WHERE nombre = ?");
                    $stmt->bind_param("s", $elemento["tipo"]);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        $id_tipoelemento = $result->fetch_assoc()["id_tipoelemento"];
                        $stmt = $conn->prepare("INSERT INTO `saloneventos`.`elemento` (`id_tipoelemento`, `posx`, `posy`, `id_evento`) VALUES (?, ?, ?, ?)");
                        $stmt->bind_param("iiii", $id_tipoelemento, $elemento["posx"], $elemento["posy"], $last_id);
                        $stmt->execute();
                    }
                    else{
                        echo "No se encontro el elemento";
                    }
                }
              }
              echo "Evento creado";
        } else {
            echo "Error: " . $stmt->error;
        }
    }
    else{
        echo "No se encontro al cliente";
    }
   

    
    $stmt->close();
    $conn->close();
}
?>
