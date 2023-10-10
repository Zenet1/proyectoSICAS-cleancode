<?php
//header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include_once("Servicios/Externo/ExternoControl.Servicio.php");
include_once("Servicios/Externo/ReservacionesExterno.Servicio.php");
include_once("../Clases/Query.Class.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Fechas.Class.php");
include_once("../Clases/Qr.Class.php");
include_once("../Clases/Email.Class.php");

if(session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

$json = file_get_contents('php://input');
$datos = json_decode($json);

$conexion = isset($_SESSION["Conexion"]) ? $_SESSION["Conexion"] : "FMAT";

Conexion::ReconfigurarConexion($conexion);
$QueryObj = new Query();
$QrControl = new GeneradorQr();
$Fechas = Fechas::ObtenerInstancia();

$ExternoControl = new ExternoControl($QueryObj, $Fechas);
$ReservacionExterno = new ReservacionExterno($QueryObj, $Fechas);

switch ($datos->accion) {
    case "insertarReservaExterno":
        $ReservacionExterno->insertarReservaExterno($datos->oficinas, $datos->fecha);
        break;
    case "enviarQRExterno":
        Conexion::ReconfigurarConexion("CAMPUS");
        $ExternoControl->enviarQRExterno($datos->oficinas, $datos->fecha, $QrControl, Conexion::ConexionInstacia("CAMPUS"));
        break;
    case "FechaActual":
        echo json_encode($Fechas->FechaAct());
        break;
}
