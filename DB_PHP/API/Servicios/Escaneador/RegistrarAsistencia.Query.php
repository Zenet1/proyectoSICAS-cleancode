<?php

class RegistrarQuery
{
    private array $Queries;

    public function __construct()
    {
        $this->Queries["SELECTResAl"] = "SELECT ALM.NombreAlumno,ALM.ApellidoPaternoAlumno,ALM.ApellidoMaternoAlumno FROM reservacionesalumnos AS RSAL INNER JOIN cargaacademica AS CGAC ON CGAC.IDCarga=RSAL.IDCarga INNER JOIN alumnos AS ALM ON CGAC.IDAlumno=ALM.IDAlumno WHERE CGAC.IDAlumno=:id AND RSAL.IDReservaAlumno=:idr AND RSAL.FechaReservaAl=:fch";

        $this->Queries["SELECTResEx"] = "SELECT EX.NombreExterno, EX.ApellidosExterno FROM reservacionesexternos AS RSEX INNER JOIN externos AS EX ON EX.IDExterno = RSEX.IDExterno WHERE RSEX.IDExterno=:id AND RSEX.IDReservaExterno=:idr AND RSEX.FechaReservaExterno=:fch";

        $this->Queries["SELECTResPer"] = "SELECT PER.Nombres,PER.ApellidoPaterno,PER.ApellidoMaterno FROM reservacionespersonal AS RSPE INNER JOIN personal AS PER ON PER.IDPersonal=RSPE.IDPersonal WHERE RSPE.IDReserva=:idr AND PER.IDPersonal=:id AND RSPE.FechaReserva=:fch";

        $this->Queries["SELECTResPro"] = "SELECT ACAD.NombreProfesor,ACAD.ApellidoPaternoProfesor,ACAD.ApellidoMaternoProfesor FROM reservacionesacademicos AS RSPE INNER JOIN academicos AS ACAD ON ACAD.IDProfesor=RSPE.IDPersonal WHERE ACAD.IDProfesor=:id AND RSPE.FechaReserva=:fch AND RSPE.IDReserva=:idr";

        $this->Queries["INSERTAsisAl"] = "INSERT INTO asistenciasalumnos (IDAlumno,FechaAl,HoraIngresoAl) SELECT :id,:fch,:hri FROM DUAL WHERE NOT EXISTS (SELECT IDAlumno,FechaAl FROM asistenciasalumnos WHERE IDAlumno=:id AND FechaAl=:fch)";

        $this->Queries["INSERTAsisEx"] = "INSERT INTO asistenciasexternos (IDExterno,FechaExterno,HoraIngresoEx) SELECT :id,:fch,:hri FROM DUAL WHERE NOT EXISTS (SELECT IDExterno,FechaExterno FROM asistenciasexternos WHERE IDExterno=:id AND FechaExterno=:fch)";

        $this->Queries["INSERTAsisPer"] = "INSERT INTO asistenciaspersonal (FechaAsistencia,HoraAsistencia,IDPersonal) SELECT :fch,:hri,:id FROM DUAL WHERE NOT EXISTS(SELECT IDPersonal,FechaAsistencia FROM asistenciaspersonal WHERE IDPersonal=:id AND FechaAsistencia=:fch)";

        $this->Queries["INSERTAsisPro"] = "INSERT INTO asistenciasacademicos (FechaAsistencia,HoraAsistencia,IDAcademico) SELECT :fch,:hri,:id FROM DUAL WHERE NOT EXISTS(SELECT IDAcademico,FechaAsistencia FROM asistenciasacademicos WHERE IDAcademico=:id AND FechaAsistencia=:fch)";
    }

    public function recuperarQuery(string $nombreQuery): string
    {
        return $this->Queries[$nombreQuery];
    }
}
