<?php
class Edificio{
    private Query $objQuery;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
    }

    public function recuperarEdificios(){
        $sql_obtenerEdificios = "SELECT NombreEdificio FROM edificios ORDER BY NombreEdificio";
        $edificiosRecuperados = $this->objQuery->ejecutarConsulta($sql_obtenerEdificios, array());
        echo json_encode($edificiosRecuperados);
    }
}
