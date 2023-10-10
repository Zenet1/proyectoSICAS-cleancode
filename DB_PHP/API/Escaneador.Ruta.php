<?php

//header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include_once('Servicios/Escaneador/RegistrarAsistencia.Servicio.php');
include_once("../Clases/Query.Class.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Fechas.Class.php");

$json = file_get_contents('php://input');
$datos = json_decode($json);

$ConexionDato = explode(",", (string)$datos->contenido);

$Conexion = Conexion::ConexionInstacia($ConexionDato[0]);
Conexion::ReconfigurarConexion($ConexionDato[0]);

$Fechas = Fechas::ObtenerInstancia();
$Query = new Query();

$AsistenciaControl = new RegistrarAsistencia(new Query(), $Fechas);

switch ($datos->accion) {
    case "registrarAsistencia":
        $AsistenciaControl->Asistencias((string)$datos->contenido);
        break;
}
