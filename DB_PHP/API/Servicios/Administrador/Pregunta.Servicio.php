<?php

class Pregunta
{
    private Query $objQuery;
    private string $SELECTPreguntas;

    public function __construct(Query $objQuery)
    {
        $this->objQuery = $objQuery;
        $this->SELECTPreguntas = "SELECT * FROM preguntas";
    }

    public function recuperarPreguntas()
    {
        $preguntas = $this->objQuery->ejecutarConsulta($this->SELECTPreguntas, array());
        echo json_encode($preguntas);
    }

    public function eliminarPregunta(array $contenido)
    {
        $sql_eliminarPregunta = "DELETE FROM preguntas WHERE IDPregunta=:pgr or Enlace=:pgr";
        $this->objQuery->ejecutarConsulta($sql_eliminarPregunta, array("pgr" => $contenido[0]));
    }

    public function insertarPregunta(array $contenido)
    {
        $sql_registrarPregunta = "INSERT INTO preguntas (Pregunta,Respuesta,Enlace) SELECT :pgr,:rpt,:enl FROM DUAL WHERE NOT EXISTS (SELECT Pregunta FROM preguntas WHERE Pregunta=:pgr) LIMIT 1";
        $enlace = ($contenido["tipo"] === "primaria" ? null : $contenido["preguntaEnlace"]);

        $incognitas = array("pgr" => $contenido["pregunta"], "rpt" => $contenido["respuesta"], "enl" => $enlace);
        $this->objQuery->ejecutarConsulta($sql_registrarPregunta, $incognitas);
    }

    public function FiltrarPreguntas()
    {
        $preguntas = $this->objQuery->ejecutarConsulta($this->SELECTPreguntas, array());
        $preguntasSec = array();
        $preguntasPrim = array();

        foreach ($preguntas as $DATO) {
            if ($DATO["Enlace"] === null) {
                $preguntasPrim[] = array_shift($preguntas);
            } else {
                $preguntasSec[] = array_shift($preguntas);
            }
        }

        $preguntasFiltradas["primarias"] = $preguntasPrim;
        $preguntasFiltradas["secundarias"] = $preguntasSec;

        echo json_encode($preguntasFiltradas);
    }
}
