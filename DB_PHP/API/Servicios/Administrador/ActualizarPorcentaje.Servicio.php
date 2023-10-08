<?php

class Porcentaje
{
    private Query $objQuery;
    private string $SELECTPorcentaje;
    private string $UPDATEPorcentaje;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
        $this->SELECTPorcentaje = "SELECT Porcentaje FROM porcentajecapacidad";
        $this->UPDATEPorcentaje = "UPDATE porcentajecapacidad SET Porcentaje=:pct WHERE IDPorcentaje=1";
    }

    public function RecuperarPorcentaje()
    {
        $porcentaje = $this->objQuery->ejecutarConsulta($this->SELECTPorcentaje, array());
        echo json_encode($porcentaje[0]["Porcentaje"]);
    }

    public function ActualizarPorcentaje(array $porcentaje)
    {
        $this->objQuery->ejecutarConsulta($this->UPDATEPorcentaje, array("pct" => $porcentaje["porcentaje"]));
    }
}
