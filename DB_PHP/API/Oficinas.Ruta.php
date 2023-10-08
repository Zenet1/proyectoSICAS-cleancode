<?php
session_start();
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Credentials: true ");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Custom-Header, Origin, Content-Type , Authorisation , X-Requested-With");
header("Content-Type: application/json; charset=UTF-8 ");

include_once("Servicios/Administrador/Edificio.Servicio.php");
include_once("Servicios/Administrador/Oficina.Servicio.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Query.Class.php");

$datos = null;
$accion = null;

if (isset($_POST) && sizeof($_POST) > 0) {
    $accion = $_POST["accion"];
} else {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    $accion = $datos->accion;
}

$Conexion = Conexion::ConexionInstacia($_SESSION["Conexion"]);
Conexion::ReconfigurarConexion($_SESSION["Conexion"]);
$QueryObj = new Query();
$EdificioControl = new Edificio($QueryObj);
$OficinaControl = new Oficina($QueryObj);

switch ($accion) {
    case "recuperarEdificios":
        $EdificioControl->recuperarEdificios();
        break;
    case "recuperarOficinas":
        $OficinaControl->recuperarOficinas();
        break;
    case "eliminarOficina":
        $OficinaControl->eliminarOficina((string)$datos->contenido);
        break;
    case "agregarOficina":
        $OficinaControl->insertarOficina((array)$datos->contenido);
        break;
}
