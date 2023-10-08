<?php
include_once("RegistrarAsistencia.Query.php");

class RegistrarAsistencia
{
    private Query $objQuery;
    private RegistrarQuery $regQuery;
    private Fechas $fecha;
    private array $respuesta;

    public function __construct(Query $objQuery, Fechas $fecha)
    {
        $this->objQuery = $objQuery;
        $this->regQuery = new RegistrarQuery();
        $this->respuesta["respuesta"] = "invalido";
        $this->fecha = $fecha;
    }

    public function Asistencias(string $contenido)
    {
        $codigoQr = explode(",", $contenido);
        array_shift($codigoQr);
        $tipo = array_shift($codigoQr);
        $id = array_shift($codigoQr);

        if ($this->TipoValido($tipo)) {
            $operaciones = $this->TipoOperacion($tipo);
            if ($this->ValidarReservaciones($operaciones[0], $id, $codigoQr)) {
                $this->InsertarAsistencia($operaciones[1], $id);
            }
        }
        echo json_encode($this->respuesta);
    }

    private function ValidarReservaciones(string $operacion, int $id, array $codigoQr): bool
    {
        $resultado = array();
        foreach ($codigoQr as $IDRESERVA) {
            $incognitas = array("id" => $id, "idr" => $IDRESERVA, "fch" => $this->fecha->FechaAct());
            $resultado = $this->objQuery->ejecutarConsulta($operacion, $incognitas);
            if ($resultado === false || sizeof($resultado) === 0) {
                return false;
            }
        }
        $this->respuesta["NombreCompleto"] = $this->AsignarNombre($resultado[0]);
        $this->respuesta["respuesta"] = "valido";
        return true;
    }

    private function InsertarAsistencia(String $operacion, int $id)
    {
        $incognitas = array("id" => $id, "fch" => $this->fecha->FechaAct(), "hri" => $this->fecha->HrAct());
        $this->objQuery->ejecutarConsulta($operacion, $incognitas);
    }

    private function TipoValido(string $tipo): bool
    {
        $esValido = false;
        switch ($tipo) {
            case "a":
                $esValido =  true;
                break;
            case "e":
                $esValido = true;
                break;
            case "pro":
                $esValido = true;
                break;
            case "per":
                $esValido = true;
                break;
        }
        return $esValido;
    }

    private function TipoOperacion(string $tipo): array
    {
        switch ($tipo) {
            case "a":
                return array($this->regQuery->recuperarQuery("SELECTResAl"), $this->regQuery->recuperarQuery("INSERTAsisAl"));
                break;
            case "e":
                return array($this->regQuery->recuperarQuery("SELECTResEx"), $this->regQuery->recuperarQuery("INSERTAsisEx"));
            case "pro":
                return array($this->regQuery->recuperarQuery("SELECTResPro"), $this->regQuery->recuperarQuery("INSERTAsisPro"));
                break;
            case "per":
                return array($this->regQuery->recuperarQuery("SELECTResPer"), $this->regQuery->recuperarQuery("INSERTAsisPer"));
                break;
        }
    }

    private function AsignarNombre(array $nombre)
    {
        $nombreCompleto = "";
        $contPartes = 0;
        foreach ($nombre as $Clave => $Valor) {
            $nombreCompleto .= $Valor . (++$contPartes < sizeof($nombre) ? " " : "");
        }
        return $nombreCompleto;
    }
}
