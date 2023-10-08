<?php
include_once("ReservaPersonal.Query.php");

class ReservaPersonal
{
    private Query $objQuery;
    private ReservaQuery $objRes;
    private Fechas $fecha;

    public function __construct(Query $objQuery, Fechas $fecha)
    {
        $this->objQuery = $objQuery;
        $this->fecha = $fecha;
        $this->objRes = new ReservaQuery();
    }

    public function InsertarReserva(array $contenido, GeneradorQr $qr, Conexion $conexion)
    {
        $sql_insertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,contenidoQR,nombreQR,TipoCorreo)SELECT :cor,:nom,:asu,:mes,:con,:noq,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

        $incogInser = array("idp" => $_SESSION["ID"], "fchA" => $this->fecha->FechaAct(), "hrA" => $this->fecha->HrAct(), "fchR" => $this->fecha->FechaSig());

        $incogSelect = array("idp" => $_SESSION["ID"], "fchR" => $this->fecha->FechaAct());

        $resultado = "";
        $NombreImagen = "";
        $contenidoQr = "";

        if ($contenido["rol"] === "Personal") {
            $this->objQuery->ejecutarConsulta($this->objRes->InsertarReservaPer(), $incogInser);
            $resultado = $this->objQuery->ejecutarConsulta($this->objRes->RecuperarID("reservacionespersonal"), $incogSelect);

            $NombreImagen = "per" . $_SESSION["ID"];
            $contenidoQr = $_SESSION["Conexion"] . "," . "per" . "," . $_SESSION["ID"] . "," . $resultado[0]["IDReserva"];
        }

        if ($contenido["rol"] === "Profesor") {
            $this->objQuery->ejecutarConsulta($this->objRes->InsertarReservaPro(), $incogInser);
            $resultado = $this->objQuery->ejecutarConsulta($this->objRes->RecuperarID("reservacionesacademicos"), $incogSelect);

            $NombreImagen = "pro" . $_SESSION["ID"];
            $contenidoQr = $_SESSION["Conexion"] . "," . "pro" . "," . $_SESSION["ID"] . "," . $resultado[0]["IDReserva"];
        }

        $asunto = "Codigo QR Asistencia";
        $mensaje = "A continuacion se le envia el codigo QR valido unicamente en fecha ";
        $mensaje .= $this->fecha->FechaSig() . " en su correspondiente facultad, se le exhorta a guardar la imagen";
        $mensaje .= "para evitar cualquier contratiempo";

        $imagenCodigo = dirname(__FILE__, 3) . "/img/" . $NombreImagen . ".png";

        $datosQr = array("noq" => $imagenCodigo, "con" => $contenidoQr, "mes" => $mensaje, "cor" => $_SESSION["Correo"], "nom" => $_SESSION["Nombre"], "asu" => $asunto, "tip" => "PAAE");

        $qr->setNombrePng(basename($NombreImagen, ".png"));
        $qr->GenerarImagen($contenidoQr);

        $conexion::ReconfigurarConexion("CAMPUS");
        $conexion::ConexionInstacia("CAMPUS");
        $PDO = $conexion->getConexion();
        $objInsert = $PDO->prepare($sql_insertar);
        $objInsert->execute($datosQr);
    }

    public function validarReservaNoExistente(array $contenido)
    {
        $Respuesta = "Aceptado";
        $incognitas = array("idp" => $_SESSION["ID"], "fchR" => $this->fecha->FechaAct());
        $sql = "";

        if ($contenido[0] === "Personal") {
            $sql = $this->objRes->RecuperarID("reservacionespersonal");
        }

        if ($contenido[0] === "Profesor") {
            $sql = $this->objRes->RecuperarID("reservacionesacademicos");
        }

        $Reservaciones = $this->objQuery->ejecutarConsulta($sql, $incognitas);

        if (sizeof($Reservaciones) > 0) {
            $Respuesta = "Rechazado";
        }
        echo json_encode($Respuesta);
    }
}
