<?php
session_start();
$EmailPath = realpath(dirname(__FILE__, 3) . "/Clases/Email.Class.php");
$QueryPath = realpath(dirname(__FILE__, 3) . "/Clases/Query.Class.php");
include_once($EmailPath);
include_once($QueryPath);
$QueryControl = new Query();
$CorreoControl = new CorreoManejador();


$sqlCantidadCorreos = "SELECT COUNT(IDCorreo) AS CANT FROM correos WHERE TipoCorreo='RA'";
$sqlEliminarCorreo = "DELETE FROM correos WHERE IDCorreo=:idc";

$ResultCant = $QueryControl->ejecutarConsulta($sqlCantidadCorreos, array());

$limCorreos = 10;
$contElimanos = 0;
$cantCorreos = intval($ResultCant[0]["CANT"]);
$cantCorreosSobrantes = $cantCorreos - $limCorreos;
$limActualizado = ($cantCorreosSobrantes  >= $limCorreos ? $limCorreos : $cantCorreos);

$sqlRecuperarCorreos = "SELECT * FROM correos WHERE TipoCorreo='RA' LIMIT $limActualizado";

if ($cantCorreos <= 0) {
    exit();
}

$Correos = $QueryControl->ejecutarConsulta($sqlRecuperarCorreos, array());

foreach ($Correos as $datos) {
    $destinatario = array($datos["correo"] => $datos["nombre"]);
    $mensaje  = $datos["mensaje"];
    $asunto = $datos["asunto"];

    $CorreoControl->EnviarCorreo($destinatario, $asunto, $mensaje);

    $QueryControl->ejecutarConsulta($sqlEliminarCorreo, array("idc" => $datos["IDCorreo"]));

    if (++$contElimanos > $limActualizado) {
        break;
    }
}
session_write_close();
