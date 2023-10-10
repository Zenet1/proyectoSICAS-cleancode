<?php
//header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("Servicios/Alumno/ReservacionesControl.Servicio.php");
include_once("Servicios/Alumno/AlumnoControl.Servicio.php");
include_once("../Clases/Query.Class.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Fechas.Class.php");
include_once("../Clases/Qr.Class.php");
include_once("../Clases/Email.Class.php");

$json = file_get_contents('php://input');
$datosAlumno = json_decode($json);

print_r($datosAlumno);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_id($datosAlumno->cuenta);
    session_start();
}

Conexion::ReconfigurarConexion("FMAT");
$Fechas = Fechas::ObtenerInstancia();
$QrControl = new GeneradorQr();
$Query = new Query();

$ReservacionesControl = new ReservaControl($Query, $Fechas);
$AlumnosControl = new AlumnoControl($Query, $Fechas);

switch ($datosAlumno->accion) {
    case "validacionReservas":
        $ReservacionesControl->validarReservaNoExistente();
        break;
    case "obtenerClases":
        $ReservacionesControl->obtenerMateriasDisponibles();
        break;
    case "insertarReservas":
        $materias = $ReservacionesControl->insertarReservasAlumno((array)$datosAlumno->contenido);
        Conexion::ReconfigurarConexion("CAMPUS");
        $AlumnosControl->EnviarQRCorreo($materias, $QrControl, Conexion::ConexionInstacia("CAMPUS"));
        break;
    case "comprobarSuspension":
        $AlumnosControl->ChecarIncidente();
        break;
}
