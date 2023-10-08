<?php
include_once("Reservaciones.Query.php");
class ReservaControl
{
    private Query $objQuery;
    private Fechas $objFecha;
    private ReservaQuery $objResQuery;

    public function __construct(Query $objQuery, Fechas $objFecha)
    {
        $this->objQuery = $objQuery;
        $this->objFecha = $objFecha;
        $this->objResQuery = new ReservaQuery();
    }

    public function validarReservaNoExistente()
    {
        $Respuesta = "Aceptado";
        $incognitas = array("ida" => $_SESSION["IDAlumno"], "fchA" => $this->objFecha->FechaAct());
        $Reservaciones = $this->objQuery->ejecutarConsulta($this->objResQuery->ExisteReserva(), $incognitas);

        if (sizeof($Reservaciones) > 0) {
            $Respuesta = "Rechazado";
        }
        echo json_encode($Respuesta);
    }

    public function obtenerMateriasDisponibles()
    {
        $gruposValidados = array();
        $incognitas = array("ida" => $_SESSION["IDAlumno"], "dia" => $this->objFecha->DiaSig());
        $resultado = $this->objQuery->ejecutarConsulta($this->objResQuery->Grupos(), $incognitas);

        foreach ($resultado as $MATERIA) {
            if ($this->ValidarCupo($MATERIA)) {
                $gruposValidados[] = $MATERIA;
            }
        }
        echo json_encode($gruposValidados);
    }

    public function insertarReservasAlumno(array $contenido): array
    {
        $materias = array();
        foreach ($contenido as $MATERIA) {
            if ($this->ValidarCupo((array)$MATERIA)) {
                $incognitas = array("idc" => $MATERIA->IDCarga, "fchR" => $this->objFecha->FechaSig(), "hrI" => $MATERIA->HoraInicioHorario, "hrF" => $MATERIA->HoraFinHorario, "fchA" => $this->objFecha->FechaAct(), "hrA" => $this->objFecha->HrAct());
                $this->objQuery->ejecutarConsulta($this->objResQuery->InsertarReservacion(), $incognitas);
                $materias[] = $MATERIA;
            }
        }
        return $materias;
    }

    private function ValidarCupo(array $asignatura): bool
    {
        $incognitas = array("idg" => $asignatura["IDGrupo"], "fchR" => $this->objFecha->FechaSig());
        $cuposOcupados = $this->objQuery->ejecutarConsulta($this->objResQuery->CuposDisconibles(), $incognitas);
        $porcentaje = $this->objQuery->ejecutarConsulta($this->objResQuery->PorcetajeFac(), array());

        $capasidadSalon = intval($asignatura["Capacidad"] * ($porcentaje[0]["Porcentaje"] / 100));

        if (intval($cuposOcupados[0]["CR"]) < $capasidadSalon) {
            return true;
        }
        return false;
    }
}
