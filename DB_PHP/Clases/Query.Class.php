<?php
include_once('Conexion.Class.php');
class Query
{
    private Conexion $conexion;

    public function __construct()
    {
        $this->conexion = Conexion::ConexionInstacia();
    }

    public function ejecutarConsulta(string $query, array $variables)
    {
        $objSelect = $this->conexion->getConexion()->prepare($query);
        $objSelect->execute($variables);
        return $objSelect->fetchAll(PDO::FETCH_ASSOC);
    }
}
