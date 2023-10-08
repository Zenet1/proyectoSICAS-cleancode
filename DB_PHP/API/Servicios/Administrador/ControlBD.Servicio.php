<?php
include_once("ControlBD.Queries.php");

class ControlBD
{
    private Query $objQuery;
    private ControlBDQueries $queries;
    private array $tablas;

    public function __construct(Query $objQuery)
    {
        $this->tablas = array("externos", "reservacionesalumnos", "reservacionesexternos", "reservacionesacademicos", "reservacionespersonal","asistenciasalumnos", "asistenciasexternos", "asistenciasacademicos", "asistenciaspersonal","incidentes");
        $this->queries = new ControlBDQueries();
        $this->objQuery = $objQuery;
    }

    public function EliminarBD(Fechas $fecha)
    {
        foreach ($this->queries->ObtenerQueriesEliminar() as $QUERYELIMINAR) {
            $this->objQuery->ejecutarConsulta($QUERYELIMINAR, array("fch" => $fecha->FechaAct()));
        }
    }

    public function Respaldar(ArchivoControl $archivoControl, Fechas $fecha)
    {
        foreach ($this->tablas as $tabla) {
            $this->RespaldarTablas($tabla, $this->queries->ObtenerQueryRespaldar($tabla), array($fecha->FechaAct()));
        }
        $archivoControl->descargarArchivos("zipRespaldo", ArchivoControl::$carpetaUnica . "/", ".txt");
        $archivoControl->EliminarArchivos(ArchivoControl::$carpetaUnica . "/", ".txt");
        $archivoControl->EliminarArchivos(ArchivoControl::$carpetaUnica . "/", ".zip");
        rmdir($archivoControl::$carpetaUnica);
    }

    private function RespaldarTablas(string $tabla, string $Query, array $variables = null)
    {
        $archivo = fopen(ArchivoControl::$carpetaUnica . "/" . $tabla . ".txt", "w");
        $nombreColumnas = $this->objQuery->ejecutarConsulta($this->queries->RecupColumQuery($tabla), array());
        $datosTabla = $this->objQuery->ejecutarConsulta($Query, $variables);

        $indice_final = 0;

        foreach ($nombreColumnas as $columna) {
            fwrite($archivo, $columna["COLUMN_NAME"] . (++$indice_final < sizeof($nombreColumnas) ? "|" : ""));
        }
        fwrite($archivo, "\n");
        
        $indice_salto = 0;

        foreach ($datosTabla as $dato) {
            $indice_final = 0;
            foreach ($nombreColumnas as $columna) {
                fwrite($archivo, $dato[$columna["COLUMN_NAME"]] . (++$indice_final < sizeof($dato) ? "|" : ""));
            }
            fwrite($archivo, (++$indice_salto < sizeof($datosTabla) ? "\n" : ""));
        }
        fclose($archivo);
    }

    public function Restaurar(ArchivoControl $archivoControl)
    {
        $rutaArchivo = $archivoControl->MoverArchivo(ArchivoControl::$carpetaUnica . "/");
        $nombreSinExtension = basename($rutaArchivo, ".txt");
        $archivo = file($rutaArchivo);

        if (!$this->ValidarArchivo($nombreSinExtension)) {
            unlink($rutaArchivo);
            rmdir($archivoControl::$carpetaUnica);
            exit();
        }

        $esPrimeraLinea = true;
        foreach ($archivo as $LINEA) {
            
            if($esPrimeraLinea){
                $esPrimeraLinea = false;
                continue;
            }
            $lnExp = explode("|", $LINEA);
            
            if(sizeof($lnExp) < 1){
                continue;
            }

            $datos = $this->FormatearLinea($lnExp, $nombreSinExtension);
            $query = $this->queries->ObtenerQueryRestaurar($nombreSinExtension);
            $this->objQuery->ejecutarConsulta($query, $datos);
        }
        $archivoControl->EliminarArchivos(ArchivoControl::$carpetaUnica . "/", ".txt");
        rmdir($archivoControl::$carpetaUnica);
    }

    private function ValidarArchivo(string $nombreSinExtension): bool
    {
        return in_array($nombreSinExtension, $this->tablas);
    }

    private function FormatearLinea(array $lnExp, string $nombreSinExtension): array
    {
        $datosRestaurar = array();
        switch ($nombreSinExtension) {
            case "externos":
                $datosRestaurar = array("ide" => $lnExp[0], "nme" => $lnExp[1], "ape" => $lnExp[2], "ame" => $lnExp[3], "emp" => $lnExp[4]);
                break;
            case "reservacionesalumnos":
                $datosRestaurar = array("idc" => $lnExp[1], "fcRA" => $lnExp[2], "hri" => $lnExp[3], "hrf" =>  $lnExp[4], "fca" => $lnExp[5], "hra" => $lnExp[6]);
                break;
            case "reservacionesexternos":
                $datosRestaurar = array("ide" => $lnExp[1], "ido" => $lnExp[2], "fcRE" => $lnExp[3], "fce" => $lnExp[4], "hre" => $lnExp[5]);
                break;
            case "reservacionesacademicos":
                $datosRestaurar = array("fcR" => $lnExp[1], "hr" => $lnExp[2], "idp" => $lnExp[3], "fc" => $lnExp[4]);
                break;
            case "reservacionespersonal":
                $datosRestaurar = array("fcR" => $lnExp[1], "hr" => $lnExp[2], "fc" => $lnExp[3], "idp" => $lnExp[4]);
                break;
            case "asistenciasalumnos":
                $datosRestaurar = array("ida" => $lnExp[1], "fca" =>  $lnExp[2], "hri" => $lnExp[3]);
                break;
            case "asistenciasexternos":
                $datosRestaurar = array("ide" => $lnExp[1], "fce" => $lnExp[2], "hrIE" => $lnExp[3], "hrSE" => $lnExp[4], "lgenE" =>  $lnExp[5]);
                break;
            case "asistenciasacademicos":
                $datosRestaurar = array("fcA" => $lnExp[1], "hrA" => $lnExp[2], "ida" => $lnExp[3]);
                break;
            case "asistenciaspersonal":
                $datosRestaurar = array("fcA" => $lnExp[1], "hrA" => $lnExp[2], "idp" => $lnExp[3]);
                break;
            case "incidentes":
                $datosRestaurar = array("ida" => $lnExp[1], "fca" => $lnExp[2], "fcLS" => $lnExp[3]);
                break;
        }
        return $datosRestaurar;
    }
}
