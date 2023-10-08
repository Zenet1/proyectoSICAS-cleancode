<?php

class EstadisticaQuery
{
    private string $genero;
    private string $plan;

    public function __construct()
    {
        $this->genero = " AND ALM.Genero=";
        $this->plan = " AND PLE.NombrePlan=";
    }

    public function ObtenerPersonal(string $tabla)
    {
        return "SELECT IDAsistencia FROM $tabla WHERE FechaAsistencia>=:fchI AND FechaAsistencia<=:fchF";
    }

    public function ObtenerAlumnos(string $nombreTabla): string
    {
        return "SELECT PLE.NombrePlan,PLE.SiglasPlan,ALM.Genero FROM $nombreTabla AS GEN INNER JOIN alumnos AS ALM ON ALM.IDAlumno=GEN.IDAlumno INNER JOIN planesdeestudio AS PLE ON PLE.IDPlanEstudio=ALM.IDPlanEstudio WHERE GEN.FechaAl>=:fchIn AND GEN.FechaAl<=:fchFn";
    }

    public function ObtenerGenero(string $genero): string
    {
        return ($genero !== "todos" ? $this->genero . "'$genero' " : "");
    }

    public function ObtenerPlan(string $nombrePlan): string
    {
        return ($nombrePlan !== "todos" ? $this->plan . "'$nombrePlan' " : "");
    }
}
