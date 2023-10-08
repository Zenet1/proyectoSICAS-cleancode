<?php

class AlertaQuery
{
    private string $SELECTValidarAsis;
    private string $SELECTCargas;
    private string $SELECTInvol;
    private string $SELECTProfs;
    private string $INSERTInfec;

    public function __construct()
    {
        $this->SELECTValidarAsis = "SELECT ASISAL.FechaAl FROM asistenciasalumnos AS ASISAL INNER JOIN alumnos AS ALM ON ALM.IDAlumno=ASISAL.IDAlumno WHERE ALM.Matricula=:mat AND ASISAL.FechaAl>=:fchIn AND ASISAL.FechaAl<=:fchFn";

        $this->SELECTCargas = "SELECT CGAC.IDGrupo,RSAL.FechaReservaAl, ASIG.NombreAsignatura,GPS.Grupo FROM reservacionesalumnos AS RSAL INNER JOIN cargaacademica AS CGAC ON CGAC.IDCarga=RSAL.IDCarga INNER JOIN alumnos AS ALM ON ALM.IDAlumno=CGAC.IDAlumno INNER JOIN grupos AS GPS ON GPS.IDGrupo=CGAC.IDGrupo INNER JOIN asignaturas AS ASIG ON ASIG.IDAsignatura=GPS.IDAsignatura WHERE ALM.Matricula=:mat AND RSAL.FechaReservaAl=:fch";

        $this->SELECTInvol = "SELECT ALM.Matricula,ALM.IDAlumno,ALM.CorreoAlumno AS CORREO,ALM.NombreAlumno AS NOMBRE,ALM.ApellidoPaternoAlumno AS APELLIDOP,ALM.ApellidoMaternoAlumno AS APELLIDOM FROM cargaacademica AS CGAC INNER JOIN asistenciasalumnos AS ASAL ON ASAL.IDAlumno=CGAC.IDAlumno INNER JOIN alumnos AS ALM ON ALM.IDAlumno=CGAC.IDAlumno WHERE CGAC.IDGrupo=:idg AND ASAL.FechaAl=:fch AND ALM.Matricula!=:mat";

        $this->SELECTProfs = "SELECT ACAD.CorreoProfesor AS CORREO, ACAD.NombreProfesor AS NOMBRE, ACAD.ApellidoPaternoProfesor AS APELLIDOP, ACAD.ApellidoMaternoProfesor AS APELLIDOM FROM academicos AS ACAD INNER JOIN grupos AS GPS ON GPS.IDProfesor=ACAD.IDProfesor WHERE GPS.IDGrupo=:idg";
        
        $this->INSERTInfec = "INSERT INTO incidentes (IDAlumno, FechaAl, FechaLimiteSuspension) SELECT :ida,:fchA,:fchL FROM DUAL WHERE NOT EXISTS (SELECT IDIncidente FROM incidentes WHERE IDAlumno=:ida AND FechaAl=:fchA AND FechaLimiteSuspension=:fchL) LIMIT 1";
    }

    public function ObtenerAsistencias(): string
    {
        return $this->SELECTValidarAsis;
    }

    public function CargasAcademicas(): string
    {
        return $this->SELECTCargas;
    }

    public function ObtenerInvol(): string
    {
        return $this->SELECTInvol;
    }

    public function ObtenerProf(): string
    {
        return $this->SELECTProfs;
    }

    public function AgregarIncidente():string{
        return $this->INSERTInfec;
    }
}
