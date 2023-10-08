<?php

class PlanesControl
{
    private Query $objQuery;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
    }

    public function RecuperarPlanesEstudio()
    {
        $sql_recuperarPlanes = "SELECT NombrePlan from planesdeestudio";
        $resultado = $this->objQuery->ejecutarConsulta($sql_recuperarPlanes, array());
        echo json_encode($this->FiltrarPlanes($resultado));
    }

    private function FiltrarPlanes(array $planes): array
    {
        $planesFiltrados = array();
        
        foreach ($planes as $array) {
            if(!in_array($array, $planesFiltrados)){
                $planesFiltrados[] = array_shift($planes);
            } else {
                array_shift($planes);
            }
        }
        return $planesFiltrados;
    }
}
