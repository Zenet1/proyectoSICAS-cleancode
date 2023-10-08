<?php

class ControlBDQueries
{
    private array $querieRespaldar;
    private array $queriesRestaurar;
    private array $querieEliminar;

    public function __construct()
    {
        $this->querieEliminar[] = "DELETE FROM externos";
        $this->querieEliminar[] = "DELETE FROM asistenciasalumnos";
        $this->querieEliminar[] = "DELETE FROM asistenciasexternos";
        $this->querieEliminar[] = "DELETE FROM asistenciasacademicos";
        $this->querieEliminar[] = "DELETE FROM asistenciaspersonal";
        $this->querieEliminar[] = "DELETE FROM reservacionesalumnos WHERE FechaAlumno<:fch";
        $this->querieEliminar[] = "DELETE FROM reservacionesexternos WHERE FechaExterno<:fch";
        $this->querieEliminar[] = "DELETE FROM reservacionesacademicos WHERE FechaActual<:fch";
        $this->querieEliminar[] = "DELETE FROM reservacionespersonal WHERE FechaActual<:fch";
        $this->querieEliminar[] = "DELETE FROM incidentes WHERE FechaAl<:fch";

        $this->queriesRestaurar["externos"] = "INSERT INTO externos (IDExterno, NombreExterno, ApellidosExterno, Empresa, CorreoExterno) SELECT :ide,:nme,:ape,:ame,:emp FROM DUAL WHERE NOT EXISTS (SELECT IDExterno FROM externos WHERE IDExterno=:ide) LIMIT 1";

        $this->queriesRestaurar["reservacionesalumnos"] = "INSERT INTO reservacionesalumnos (IDCarga, FechaReservaAl,HoraInicioReservaAl, HoraFinReservaAl, FechaAlumno, HoraAlumno) SELECT :idc,:fcRA,:hri,:hrf,:fca,:hra FROM DUAL WHERE NOT EXISTS (SELECT IDCarga, FechaReservaAl FROM reservacionesalumnos WHERE IDCarga=:idc AND FechaReservaAl=:fcRA) LIMIT 1";

        $this->queriesRestaurar["reservacionesexternos"] = "INSERT INTO reservacionesexternos (IDExterno, IDOficina, FechaReservaExterno, FechaExterno, HoraExterno) SELECT :ide,:ido,:fcRE,:fce,:hre FROM DUAL WHERE NOT EXISTS (SELECT IDExterno, FechaReservaExterno FROM reservacionesexternos WHERE IDExterno=:ide AND FechaReservaExterno=:fcRE) LIMIT 1";

        $this->queriesRestaurar["reservacionesacademicos"] = "INSERT INTO reservacionesacademicos (FechaReserva, HoraActual, IDPersonal, FechaActual) SELECT :fcR,:hr,:idp,:fc FROM DUAL WHERE NOT EXISTS (SELECT IDPersonal, FechaReserva FROM reservacionesacademicos WHERE IDPersonal=:idp AND FechaReserva=:fcR) LIMIT 1";

        $this->queriesRestaurar["reservacionespersonal"] = "INSERT INTO reservacionespersonal (FechaReserva, HoraActual, FechaActual, IDPersonal) SELECT :fcR,:hr,:fc,:idp FROM DUAL WHERE NOT EXISTS (SELECT IDPersonal, FechaReserva FROM reservacionespersonal WHERE IDPersonal=:idp AND FechaReserva=:fcR) LIMIT 1";

        $this->queriesRestaurar["asistenciasalumnos"] = "INSERT INTO asistenciasalumnos (IDAlumno, FechaAl, HoraIngresoAl) SELECT :ida,:fca,:hri FROM DUAL WHERE NOT EXISTS (SELECT IDAlumno, FechaAl FROM asistenciasalumnos WHERE IDAlumno=:ida AND FechaAl=:fca) LIMIT 1";

        $this->queriesRestaurar["asistenciasexternos"] = "INSERT INTO asistenciasexternos (IDExterno, FechaExterno, HoraIngresoEx, HoraSalidaEx, LugarEntradaEx) SELECT :ide,:fce,:hrIE,:hrSE,:lgenE FROM DUAL WHERE NOT EXISTS (SELECT IDExterno, FechaExterno FROM asistenciasexternos WHERE IDExterno=:ide AND FechaExterno=:fce) LIMIT 1";

        $this->queriesRestaurar["asistenciasacademicos"] = "INSERT INTO asistenciasacademicos (FechaAsistencia, HoraAsistencia, IDAcademico) SELECT :fcA,:hrA,:ida FROM DUAL WHERE NOT EXISTS (SELECT IDAcademico, FechaAsistencia FROM asistenciasacademicos WHERE IDAcademico=:ida AND FechaAsistencia=:fcA) LIMIT 1";

        $this->queriesRestaurar["asistenciaspersonal"] = "INSERT INTO asistenciaspersonal (FechaAsistencia, HoraAsistencia, IDPersonal) SELECT :fcA,:hrA,:idp FROM DUAL WHERE NOT EXISTS (SELECT IDPersonal, FechaAsistencia FROM asistenciaspersonal WHERE IDPersonal=:idp AND FechaAsistencia=:fcA) LIMIT 1";

        $this->queriesRestaurar["incidentes"] = "INSERT INTO incidentes (IDAlumno, FechaAl, FechaLimiteSuspension) SELECT :ida,:fca,:fcLS FROM DUAL WHERE NOT EXISTS (SELECT IDAlumno, FechaAl, FechaLimiteSuspension FROM incidentes WHERE IDAlumno=:ida AND FechaAl=:fca AND FechaLimiteSuspension=:fcLS) LIMIT 1";

        $this->querieRespaldar["externos"] = "SELECT * FROM externos";
        $this->querieRespaldar["reservacionesalumnos"] = "SELECT * FROM reservacionesalumnos WHERE FechaAlumno<?";
        $this->querieRespaldar["reservacionesexternos"] = "SELECT * FROM reservacionesexternos WHERE FechaExterno<?";
        $this->querieRespaldar["reservacionesacademicos"] = "SELECT * FROM reservacionesacademicos WHERE FechaActual<?";
        $this->querieRespaldar["reservacionespersonal"] = "SELECT * FROM reservacionespersonal WHERE FechaActual<?";
        $this->querieRespaldar["asistenciasalumnos"] = "SELECT * FROM asistenciasalumnos";
        $this->querieRespaldar["asistenciasexternos"] = "SELECT * FROM asistenciasexternos";
        $this->querieRespaldar["asistenciasacademicos"] = "SELECT * FROM asistenciasacademicos";
        $this->querieRespaldar["asistenciaspersonal"] = "SELECT * FROM asistenciaspersonal";
        $this->querieRespaldar["incidentes"] = "SELECT * FROM incidentes WHERE FechaAl<?";
    }

    public function ObtenerQueriesEliminar(): array
    {
        return $this->querieEliminar;
    }

    public function ObtenerQueryRestaurar(string $nombreArchivo): string
    {
        return $this->queriesRestaurar[$nombreArchivo];
    }

    public function ObtenerQueryRespaldar(string $nombreArchivo): string
    {
        return $this->querieRespaldar[$nombreArchivo];
    }

    public function RecupColumQuery(string $tabla): string
    {
        return "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = Database() AND TABLE_NAME = '$tabla'";
    }
}
