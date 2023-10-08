<?php
function RecuperarCargasAcademicas(string $carpeta, PDO $Conexion)
{
    $archivo = file("$carpeta/AlumnosCargaDeAsignaturas.txt");
    $saltado = false;

    //Querys
    $sql_recuperarIDAlumno = "SELECT IDAlumno FROM alumnos WHERE Matricula = ?";

    $sql_recuperarIDProfesor = "SELECT IDProfesor FROM academicos WHERE ClaveProfesor = ?";
    $sql_recuperarIDPlanEstudio = "SELECT IDPlanEstudio FROM planesdeestudio WHERE ClavePlan = ? AND VersionPlan = ?";
    $sql_recuperarIDAsignatura = "SELECT IDAsignatura FROM asignaturas WHERE ClaveAsignatura = ? AND IDPlanEstudio = ?";
    $sql_recuperarIDGrupo = "SELECT IDGrupo FROM grupos WHERE IDAsignatura = ? AND IDProfesor = ? AND ClaveGrupo = ?";

    $sql_insertarCargaAcademica = "INSERT INTO cargaacademica (IDAlumno, IDGrupo) SELECT ?, ? FROM DUAL 
    WHERE NOT EXISTS (SELECT IDAlumno, IDGrupo FROM cargaacademica WHERE IDAlumno = ? AND IDGrupo = ?) LIMIT 1";

    //Objetos de ejecución de querys
    $obj_recuperarIDAlumno = $Conexion->prepare($sql_recuperarIDAlumno);

    $obj_recuperarIDProfesor = $Conexion->prepare($sql_recuperarIDProfesor);
    $obj_recuperarIDPlanEstudio = $Conexion->prepare($sql_recuperarIDPlanEstudio);
    $obj_recuperarIDAsignatura = $Conexion->prepare($sql_recuperarIDAsignatura);
    $obj_recuperarIDGrupo = $Conexion->prepare($sql_recuperarIDGrupo);

    $obj_insertarCargaAcademica = $Conexion->prepare($sql_insertarCargaAcademica);

    foreach ($archivo as $linea) {
        $data = explode("|",  utf8_encode(trim($linea)));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        if (sizeof($data) === 1) {
            continue;
        }

        $obj_recuperarIDAlumno->execute(array($data[0]));
        $IDAlumno = $obj_recuperarIDAlumno->fetch(PDO::FETCH_ASSOC);

        $obj_recuperarIDProfesor->execute(array($data[4]));
        $IDProfesor = $obj_recuperarIDProfesor->fetch(PDO::FETCH_ASSOC);

        $obj_recuperarIDPlanEstudio->execute(array($data[1], $data[2]));
        $IDPlanEstudio = $obj_recuperarIDPlanEstudio->fetch(PDO::FETCH_ASSOC);

        $obj_recuperarIDAsignatura->execute(array($data[3], $IDPlanEstudio["IDPlanEstudio"]));
        $IDAsignatura = $obj_recuperarIDAsignatura->fetch(PDO::FETCH_ASSOC);

        $obj_recuperarIDGrupo->execute(array($IDAsignatura["IDAsignatura"], $IDProfesor["IDProfesor"], $data[5]));
        $IDGrupo = $obj_recuperarIDGrupo->fetch(PDO::FETCH_ASSOC);

        $obj_insertarCargaAcademica->execute(array($IDAlumno["IDAlumno"], $IDGrupo["IDGrupo"], $IDAlumno["IDAlumno"], $IDGrupo["IDGrupo"]));
    }
}
