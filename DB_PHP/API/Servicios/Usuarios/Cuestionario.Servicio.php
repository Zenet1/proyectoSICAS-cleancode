<?php
class CuestionarioControl
{
    private Query $objQuery;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
    }

    public function EnviarRechazo(Conexion $conexion)
    {
        $sqlInsertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,TipoCorreo) SELECT :cor,:nom,:asu,:mes,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

        $asunto = "Rechazo de la solicitud de asistencia";
        $mensaje = "Debido a las respuestas introducidas en el cuestionario, y bajo las métricas médicas ";
        $mensaje .= "que se usan en la facultad, se te ha rechazado la solicitud de asistencia, ya que ";
        $mensaje .= "cuentas con un alto grado de probabilidad de ser portador asintomático";

        $datosCorreo = array("asu" => $asunto, "mes" => $mensaje, "nom" => $_SESSION["Nombre"], "cor" => $_SESSION["Correo"], "tip" => "RA");

        $conexion::ReconfigurarConexion("CAMPUS");
        $conexion::ConexionInstacia("CAMPUS");
        $PDO = $conexion->getConexion();
        $objInsert = $PDO->prepare($sqlInsertar);
        $objInsert->execute($datosCorreo);
    }
}
