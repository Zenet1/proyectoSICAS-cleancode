<?php
//header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("../Clases/Query.Class.php");
include_once("../Clases/Conexion.Class.php");
include_once("Servicios/Usuarios/Autenticar.Servicio.php");


$jsonUsuario = file_get_contents('php://input');
$datos = (array) json_decode($jsonUsuario);

if(session_status() !== PHP_SESSION_ACTIVE){
    session_id($datos["cuenta"]->usuario);
    session_start();
}


Conexion::ReconfigurarConexion($datos["cuenta"]->facultad);
$QueryControl = new Query();
$UsuariosControl = new Autenticar($QueryControl);

switch ($datos["accion"]) {
    case "validarINET":
        $UsuariosControl->ValidarCuenta((array) $datos["cuenta"]);
        break;
    case "validarSICAS":
        $UsuariosControl->ValidarCuenta((array) $datos["cuenta"]);
        break;
}
