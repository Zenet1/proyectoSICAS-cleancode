<?php
class Oficina
{
    private Query $objQuery;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
    }

    public function recuperarOficinas()
    {
        $sql_obtenerOficinas = "SELECT OFC.NombreOficina, OFC.Departamento, EDF.NombreEdificio, OFC.IDOficina FROM oficinas AS OFC INNER JOIN edificios AS EDF ON EDF.IDEdificio=OFC.IDEdificio";

        $oficinasRecuperadas = $this->objQuery->ejecutarConsulta($sql_obtenerOficinas, array());
        echo json_encode($oficinasRecuperadas);
    }

    public function eliminarOficina(string $IDOficina)
    {
        $sql_eliminarOficina = "DELETE FROM oficinas WHERE IDOficina=?";
        $this->objQuery->ejecutarConsulta($sql_eliminarOficina, array($IDOficina));
    }
    function insertarOficina(array $datosOficina)
    {
        $nombreOficina = $datosOficina["oficina"];
        $departamentoOficina = $datosOficina["departamento"];
        $edificioOficina = $datosOficina["edificio"];
        
        $sql_recuperarIDEdificio = "SELECT IDEdificio FROM edificios WHERE NombreEdificio=?";
        $datosDevueltos = $this->objQuery->ejecutarConsulta($sql_recuperarIDEdificio, array($edificioOficina));
        $IDEdificio = $datosDevueltos[0];
        
        if($this->validarOficinaRegistrada($nombreOficina, $departamentoOficina, $IDEdificio["IDEdificio"])){
            
            $sql_insertarOficina = "INSERT INTO oficinas (NombreOficina, Departamento, IDEdificio) SELECT ?,?,? FROM DUAL
            WHERE NOT EXISTS (SELECT NombreOficina, Departamento, IDEdificio FROM oficinas WHERE NombreOficina=? AND Departamento=? AND IDEdificio=?) LIMIT 1";

            if (isset($IDEdificio["IDEdificio"])) {
                $incognitas = array($nombreOficina, $departamentoOficina, $IDEdificio["IDEdificio"], $nombreOficina, $departamentoOficina, $IDEdificio["IDEdificio"]);
                $this->objQuery->ejecutarConsulta($sql_insertarOficina, $incognitas);
            }
        }
    }

    function validarOficinaRegistrada(string $nombreOficina, string $departamento, string $IDEdificio): bool
    {
        $sql_validarOficina = "SELECT * FROM oficinas WHERE NombreOficina=? AND Departamento=? AND IDEdificio=?";

        $oficinaDevuelta = $this->objQuery->ejecutarConsulta($sql_validarOficina, array($nombreOficina, $departamento, $IDEdificio));

        if (!$this->validarVariable($oficinaDevuelta)) {
            echo "ERROR: Oficina duplicada";
            return false;
        }
        return true;
    }

    function validarVariable(array $variable): bool
    {
        return ($variable === false || sizeof($variable) === 0);
    }
}
