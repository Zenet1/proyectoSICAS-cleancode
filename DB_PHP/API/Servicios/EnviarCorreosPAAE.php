<?php
$EmailPath = realpath(dirname(__FILE__, 3) . "/Clases/Email.Class.php");
$QrPath = realpath(dirname(__FILE__, 3) . "/Clases/Qr.Class.php");
$QueryPath = realpath(dirname(__FILE__, 3) . "/Clases/Query.Class.php");

include_once($EmailPath);
include_once($QueryPath);
include_once($QrPath);

$QueryControl = new Query();
$CorreoControl = new CorreoManejador();


$sqlCantidadCorreos = "SELECT COUNT(IDCorreo) AS CANT FROM correos WHERE TipoCorreo='PAAE'";
$sqlEliminarCorreo = "DELETE FROM correos WHERE IDCorreo=:idc";

$ResultCant = $QueryControl->ejecutarConsulta($sqlCantidadCorreos, array());

$limCorreos = 10;
$contElimanos = 0;
$cantCorreos = intval($ResultCant[0]["CANT"]);
$cantCorreosSobrantes = $cantCorreos - $limCorreos;
$limActualizado = ($cantCorreosSobrantes >= $limCorreos ? $limCorreos : $cantCorreos);

$sqlRecuperarCorreos = "SELECT * FROM correos WHERE TipoCorreo='PAAE' LIMIT $limActualizado";

if ($cantCorreos <= 0) {
    exit();
}

$Correos = $QueryControl->ejecutarConsulta($sqlRecuperarCorreos, array());

foreach ($Correos as $datos) {
    $destinatario = array($datos["correo"] => $datos["nombre"]);
    $mensaje  = $datos["mensaje"];
    $asunto = $datos["asunto"];
    $contenidoQR = $datos["contenidoQR"];
    $direccionQr = $datos["nombreQR"];

    $CorreoControl->setArchivo(true);
    $CorreoControl->EnviarCorreo($destinatario, $asunto, $mensaje, $direccionQr);
    unlink($direccionQr);

    $QueryControl->ejecutarConsulta($sqlEliminarCorreo, array("idc" => $datos["IDCorreo"]));

    if (++$contElimanos > $limActualizado) {
        break;
    }
}
