<?php
session_start();

include_once("Servicios/Administrador/Pregunta.Servicio.php");
include_once("Servicios/Usuarios/Cuestionario.Servicio.php");
include_once("../Clases/Query.Class.php");
include_once("../Clases/Email.Class.php");
include_once("../Clases/Conexion.Class.php");

$conexion = isset($_SESSION["Conexion"]) ? $_SESSION["Conexion"] : "FMAT";

Conexion::ReconfigurarConexion($_SESSION["Conexion"]);
$QueryObj = new Query();
$PreguntaControl = new Pregunta($QueryObj);
$CuestionarioControl = new CuestionarioControl($QueryObj);

$json = file_get_contents('php://input');
$datos = json_decode($json);

switch ($datos->accion) {
    case "recuperarPreguntas":
        $PreguntaControl->FiltrarPreguntas();
        break;
    case "enviarCorreo":
        Conexion::ReconfigurarConexion("CAMPUS");
        $CuestionarioControl->EnviarRechazo(Conexion::ConexionInstacia("CAMPUS"));
        break;
}
