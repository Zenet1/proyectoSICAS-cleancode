<?php
class ExternoControl
{

    private Query $objQuery;
    private Fechas $fecha;

    public function __construct(Query $objQuery, Fechas $fecha)
    {
        $this->objQuery = $objQuery;
        $this->objFecha = $fecha;
    }

    public function enviarQRExterno(array $IDOficinas, string $fechaReservada, GeneradorQr $qr, Conexion $conexion): void
    {
        if ($this->sesionActivaExterno()) {
            $sql_insertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,contenidoQR,nombreQR,TipoCorreo)SELECT :cor,:nom,:asu,:mes,:con,:noq,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

            $objCorreo = new CorreoManejador();
            $datosSesion = $this->recuperarVariablesSesion();
            $datosDestinatario = array($datosSesion["correoExterno"] => $datosSesion["nombreExterno"]);

            $contenidoCorreo = $this->generarContenidoCorreo($datosSesion["nombreExterno"], $IDOficinas, $datosSesion["fechaReservada"]);

            $nombreQR = $this->generarQRExterno($datosSesion["IDExterno"], $datosSesion["siglasFacultad"], $IDOficinas, $datosSesion["fechaReservada"], $datosSesion["fechaCuandoSeReservo"], $datosSesion["horaCuandoSeReservo"], $qr);
            
            $ubicacionQR = dirname(__FILE__, 3) . "/img/" . $nombreQR[0] . ".png";

            $datosQr = array("noq" => $ubicacionQR, "con" => $nombreQR[1], "mes" => $contenidoCorreo[1], "cor" => $_SESSION["Correo"], "nom" => $_SESSION["Nombre"], "asu" => $contenidoCorreo[0], "tip"=> "PAAE");

            $conexion::ReconfigurarConexion("CAMPUS");
            $conexion::ConexionInstacia("CAMPUS");
            $PDO = $conexion->getConexion();
            $objInsert = $PDO->prepare($sql_insertar);
            $objInsert->execute($datosQr);
        }
    }

    private function generarContenidoCorreo(string $nombreExterno, array $listaOficinas, string $fechaReservada): array
    {
        $asunto = "Clave QR para acceso";
        $mensaje = "Estimado " .  $nombreExterno . ", el siguiente correo electrónico contiene su clave única (QR) para acceder";
        $mensaje .= " a su entidad educativa correspondiente, este código es únicamente válido en la fecha " . $fechaReservada . ".\n";

        $mensaje .= "<br>Usted ha podido realizar reservaciones con éxito a las siguientes oficinas:<br><br>";
        $oficinasRecuperadas = $this->recuperarOficinasReservadas($listaOficinas);
        $mensaje .= $oficinasRecuperadas . "<br><br>";

        $mensaje .= "Se le exhorta que guarde la imagen QR para el registro de su asistencia.";

        return array($asunto, $mensaje);
    }

    private function recuperarOficinasReservadas(array $listaOficinas): string
    {
        $mensaje = "";

        foreach ($listaOficinas as $IDOficina) {
            $nombreOficina = $this->recuperarNombreOficina($IDOficina);
            $mensaje .= "<li>" . $nombreOficina . "</li>";
        }
        return $mensaje;
    }

    private function recuperarNombreOficina($IDOficina): string
    {

        $sql_recuperarOficina = "SELECT NombreOficina FROM oficinas WHERE IDOficina=?";

        $nombreOficina = $this->objQuery->ejecutarConsulta($sql_recuperarOficina, array($IDOficina));

        return $nombreOficina[0]["NombreOficina"];
    }

    private function generarQRExterno(string $IDExterno, string $siglasFacultad, array $listaIDOficinas, string $fechaReservada, string $fechaExterno, string $horaExterno, GeneradorQr $qr): array
    {
        $nombreQRExterno = "e" . $IDExterno;
        $contenidoQRExterno = $this->generarContenidoQR($IDExterno, $siglasFacultad, $listaIDOficinas, $fechaReservada, $fechaExterno, $horaExterno);

        $qr->setNombrePng(basename($nombreQRExterno, ".png"));
        $qr->GenerarImagen($contenidoQRExterno);

        return array($nombreQRExterno, $contenidoQRExterno);
    }

    private function generarContenidoQR(string $IDExterno, string $siglasFacultad, array $listaIDOficinas, string $fechaReservada, string $fechaExterno, string $horaExterno): string
    {
        $ContenidoQR = $siglasFacultad;
        $ContenidoQR .= ",e," . $IDExterno;

        foreach ($listaIDOficinas as $IDOficina) {
            $sql_recuperarIDReserva = "SELECT IDReservaExterno FROM reservacionesexternos 
            WHERE IDExterno = ? AND IDOficina = ? AND FechaReservaExterno = ? AND FechaExterno = ? AND HoraExterno = ?";
            $IDReserva = $this->objQuery->ejecutarConsulta($sql_recuperarIDReserva, array($IDExterno, $IDOficina, $fechaReservada, $fechaExterno, $horaExterno));
            $ContenidoQR .= "," . $IDReserva[0]["IDReservaExterno"];
        }

        return $ContenidoQR;
    }

    private function recuperarVariablesSesion()
    {
        $IDExterno = $_SESSION["IDExterno"];
        $correoExterno = $_SESSION["Correo"];
        $nombreExterno = $_SESSION["Nombre"] . " " . $_SESSION["ApellidosExterno"];
        $fechaCuandoSeReservo = $_SESSION['FechaActual'];
        $horaCuandoSeReservo = $_SESSION['HoraActual'];
        $fechaReservada = $_SESSION["FechaReservada"];
        $siglasFacultad = $_SESSION["Conexion"];

        return (array("IDExterno" => $IDExterno, "correoExterno" => $correoExterno, "nombreExterno" => $nombreExterno, "fechaReservada" => $fechaReservada, "fechaCuandoSeReservo" => $fechaCuandoSeReservo, "horaCuandoSeReservo" => $horaCuandoSeReservo, "siglasFacultad" => $siglasFacultad));
    }

    private function sesionActivaExterno(): bool
    {
        return (isset($_SESSION["IDExterno"]) && isset($_SESSION["Nombre"]) && isset($_SESSION["ApellidosExterno"]) && isset($_SESSION["Empresa"]) && isset($_SESSION["Correo"]) && isset($_SESSION["FechaActual"]) && isset($_SESSION["HoraActual"]) && isset($_SESSION["Conexion"]));
    }
}
