<?php
include_once("Estadisticas.Query.php");

class EstadisticaControl
{
    private Query $objQuery;
    private EstadisticaQuery $objEstic;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
        $this->objEstic = new EstadisticaQuery();
    }

    public function EstadisticasAlumno(array $contenido)
    {
        $queryCompleta = $this->objEstic->ObtenerAlumnos($contenido["tipo"]);
        $queryCompleta .= $this->objEstic->ObtenerGenero($contenido["genero"]);
        $queryCompleta .= $this->objEstic->ObtenerPlan($contenido["NombrePlan"]);

        try {
            $incognitas = array("fchIn" => $contenido["fechaInicio"], "fchFn" => $contenido["fechaFin"]);
            $datosCrudos = $this->objQuery->ejecutarConsulta($queryCompleta, $incognitas);
            if (sizeof($datosCrudos) !== 0) {
                $this->FiltradoRecursivo($datosCrudos, array());
            } else {
                throw new Exception();
            }
        } catch (Exception $e) {
            echo json_encode(array());
        }
    }

    private function FiltradoRecursivo(array $datosCrudos, array $datosFiltrados)
    {
        $datosModificados = array();
        $Genero = $datosCrudos[0]["Genero"];
        $Plan = $datosCrudos[0]["NombrePlan"];
        $Siglas = trim($datosCrudos[0]["SiglasPlan"]);
        $contGen = 0;

        foreach ($datosCrudos as $dato) {
            if ($Genero === $dato["Genero"] && $Plan === $dato["NombrePlan"]) {
                $contGen++;
            } else {
                $datosModificados[] = $dato;
            }
        }

        $datosFiltrados[$Siglas][] = array("name" => $Genero, "value" => $contGen);
        if (sizeof($datosModificados) === 0) {
            $datos["tipo"] = "alumno";
            $datos["estadisticas"] = $this->FormatoGraficaMultiple($datosFiltrados);
            echo json_encode($datos);
        } else {
            $this->FiltradoRecursivo($datosModificados, $datosFiltrados);
        }
    }

    private function FormatoGraficaMultiple(array $datos): array
    {
        $array_adaptada = array();
        foreach ($datos as $clave => $valor) {
            $array_adaptada[] = array("name" => $clave, "series" => $valor);
        }
        return $array_adaptada;
    }

    public function EstadisticasPersonal(array $datos)
    {
        $sqlPersonal = $this->objEstic->ObtenerPersonal("asistenciaspersonal");
        $sqlProfesor = $this->objEstic->ObtenerPersonal("asistenciasacademicos");
        $incognitas = array("fchI" => $datos["fechaInicio"], "fchF" => $datos["fechaFin"]);

        $resPer = $this->objQuery->ejecutarConsulta($sqlPersonal, $incognitas);
        $resPro = $this->objQuery->ejecutarConsulta($sqlProfesor, $incognitas);

        $datosEst[] = array("name" => "Personal", "value" => sizeof($resPer));
        $datosEst[] = array("name" => "Profesor", "value" => sizeof($resPro));

        $Formato["tipo"] = "personal";
        $Formato["estadisticas"] = $datosEst;

        echo json_encode($Formato);
    }
}
