<?php
session_start();

include_once("Servicios/Personal/ReservaPersonal.Servicio.php");
include_once("../Clases/Query.Class.php");
include_once("../Clases/Qr.Class.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Fechas.Class.php");


Conexion::ReconfigurarConexion($_SESSION["Conexion"]);
$QueryObj = new Query();
$QrControl = new GeneradorQr();
$PersonalControl = new ReservaPersonal($QueryObj, Fechas::ObtenerInstancia());

$json = file_get_contents('php://input');
$datos = json_decode($json);

switch ($datos->accion) {
    case "insertarReservaPersonal":
        Conexion::ReconfigurarConexion("CAMPUS");
        $PersonalControl->InsertarReserva((array) $datos->contenido, $QrControl, Conexion::ConexionInstacia("CAMPUS"));
        break;
    case "validacionReservaPersonal":
        $PersonalControl->validarReservaNoExistente((array) $datos->contenido);
        break;
}
