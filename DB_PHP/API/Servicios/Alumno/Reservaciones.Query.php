<?php

class ReservaQuery
{
    private string $SELECTCuposAct;
    private string $SELECTGrupos;
    private string $SELECTPorcentaje;
    private string $INSERTReserva;
    private string $SELECTValidarRes;

    public function __construct()
    {
        $this->INSERTReserva = "INSERT INTO reservacionesalumnos (IDCarga, FechaReservaAl, HoraInicioReservaAl, HoraFinReservaAl, FechaAlumno, HoraAlumno) SELECT :idc,:fchR,:hrI,:hrF,:fchA,:hrA FROM DUAL WHERE NOT EXISTS (SELECT IDCarga, FechaReservaAl FROM reservacionesalumnos WHERE IDCarga=:idc AND FechaReservaAl=:fchR) LIMIT 1";

        $this->SELECTCuposAct = "SELECT COUNT(RSAL.IDReservaAlumno) AS CR FROM cargaacademica AS CGAC INNER JOIN reservacionesalumnos AS RSAL ON RSAL.IDCarga=CGAC.IDCarga WHERE CGAC.IDGrupo=:idg AND RSAL.FechaReservaAl=:fchR";

        $this->SELECTGrupos = "SELECT CGAC.IDCarga, CGAC.IDGrupo,GPS.IDAsignatura,ASIG.NombreAsignatura, HRS.Dia, HRS.HoraInicioHorario, HRS.HoraFinHorario, SLS.Capacidad,SLS.NombreSalon FROM cargaacademica AS CGAC INNER JOIN grupos AS GPS ON GPS.IDGrupo=CGAC.IDGrupo INNER JOIN asignaturas As ASIG ON ASIG.IDAsignatura=GPS.IDAsignatura INNER JOIN horarios AS HRS ON HRS.IDGrupo=CGAC.IDGrupo INNER JOIN salones AS SLS ON SLS.IDSalon=HRS.IDSalon WHERE CGAC.IDAlumno=:ida AND HRS.Dia=:dia";

        $this->SELECTPorcentaje = "SELECT Porcentaje FROM porcentajecapacidad WHERE IDPorcentaje=1";

        $this->SELECTValidarRes = "SELECT RSV.IDCarga FROM reservacionesalumnos AS RSV INNER JOIN cargaacademica AS CGAC ON RSV.IDCarga=CGAC.IDCarga WHERE CGAC.IDAlumno=:ida AND RSV.FechaAlumno=:fchA";
    }

    public function CuposDisconibles(): string
    {
        return $this->SELECTCuposAct;
    }

    public function InsertarReservacion(): string
    {
        return $this->INSERTReserva;
    }

    public function PorcetajeFac(): string
    {
        return $this->SELECTPorcentaje;
    }

    public function Grupos()
    {
        return $this->SELECTGrupos;
    }

    public function ExisteReserva()
    {
        return $this->SELECTValidarRes;
    }
}
