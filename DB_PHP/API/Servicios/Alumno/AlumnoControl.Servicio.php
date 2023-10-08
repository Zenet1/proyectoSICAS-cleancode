<?php
session_start();
class AlumnoControl
{
    private Query $objQuery;
    private Fechas $objFecha;

    public function __construct(Query $objQuery, Fechas $objFecha)
    {
        $this->objQuery = $objQuery;
        $this->objFecha = $objFecha;
    }

    public function EnviarQRCorreo(array $Materias, GeneradorQr $qr, Conexion $conexion)
    {
        $sql_insertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,contenidoQR,nombreQR,TipoCorreo)SELECT :cor,:nom,:asu,:mes,:con,:noq,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

        $nombreImagen = "a" . $_SESSION["IDAlumno"];
        $contenido = $_SESSION["Conexion"] . "," . "a," . $_SESSION["IDAlumno"] . "," . $this->GenerarContenidoQR();

        $asunto = "Clave QR para acceso";
        $mensaje = "Estimado " .  $_SESSION["Nombre"] . " el siguiente correo contiene su clave unica QR para acceder";
        $mensaje .= " a su entidad educativa correspondiente, este codigo es unicamente valido en la fecha ";
        $mensaje .= $this->objFecha->FechaSig("d-m-Y") . ". Se le exhorta que guarde la imagen para evitar algun problema";
        $mensaje .= ". Las materias listadas son las que alcanzo un cupo disponible<ul>";
        $materiasCorreo = "";
        foreach ($Materias as $MATERIA) {
            $materiasCorreo .= "<li>" . $MATERIA->NombreAsignatura . "</li>";
        }
        $mensaje .= $materiasCorreo . "</ul>";

        $imagenCodigo = dirname(__FILE__, 3) . "/img/" . $nombreImagen . ".png";

        $datosQr = array("noq" => $imagenCodigo, "con" => $contenido, "mes" => $mensaje, "cor" => $_SESSION["Correo"], "nom" => $_SESSION["Nombre"], "asu" => $asunto, "tip" => "PAAE");

        $qr->setNombrePng(basename($nombreImagen, ".png"));
        $qr->GenerarImagen($contenido);

        $conexion::ReconfigurarConexion("CAMPUS");
        $conexion::ConexionInstacia("CAMPUS");
        $PDO = $conexion->getConexion();
        $objInsert = $PDO->prepare($sql_insertar);
        $objInsert->execute($datosQr);
    }

    public function ChecarIncidente()
    {
        $sqla = "SELECT FechaLimiteSuspension FROM incidentes WHERE IDAlumno=? AND FechaLimiteSuspension > ?";
        $incognitas = array($_SESSION["IDAlumno"], $this->objFecha->FechaAct());
        $resultado = $this->objQuery->ejecutarConsulta($sqla, $incognitas);
        echo json_encode($resultado);
    }

    private function GenerarContenidoQR(): string
    {
        $qrContenido = "";

        $sqlIDReservacion = "SELECT RSV.IDReservaAlumno FROM reservacionesalumnos AS RSV INNER JOIN cargaacademica AS CGAC ON RSV.IDCarga=CGAC.IDCarga WHERE CGAC.IDAlumno=:ida AND RSV.FechaAlumno=:fchA";
        $incognitas = array("ida" => $_SESSION["IDAlumno"], "fchA" => $this->objFecha->FechaAct());

        $resultado = $this->objQuery->ejecutarConsulta($sqlIDReservacion, $incognitas);
        $contIDs = 0;

        foreach ($resultado as $IDReserva) {
            $qrContenido .= $IDReserva["IDReservaAlumno"] . (++$contIDs < sizeof($resultado) ? "," : "");
        }

        return $qrContenido;
    }
}
