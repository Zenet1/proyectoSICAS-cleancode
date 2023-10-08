<?php

function RecuperarAlumnos(string $carpeta, PDO $Conexion)
{
    $archivo = file("$carpeta/AlumnosInscripcionEnPeriodoCurso.txt");
    $saltado = false;

    $insertar = "INSERT INTO alumnos (Matricula, NombreAlumno, ApellidoPaternoAlumno, ApellidoMaternoAlumno, IDPlanEstudio, CorreoAlumno, Genero, IDUsuario) SELECT ?,?,?,?,?,?,?,? FROM DUAL WHERE NOT EXISTS(SELECT Matricula FROM alumnos WHERE Matricula=?) LIMIT 1";

    $recuperar_plan = "SELECT IDPlanEstudio FROM planesdeestudio WHERE ClavePlan=? AND VersionPlan=?";
    $recuperar_id = "SELECT IDUsuario FROM usuarios WHERE Cuenta=?";

    $insertar_obj = $Conexion->prepare($insertar);
    $recuperarPlan_obj = $Conexion->prepare($recuperar_plan);
    $recuperarID_obj = $Conexion->prepare($recuperar_id);

    foreach ($archivo as $linea) {
        $datos_archivo = explode("|", utf8_encode(trim($linea)));

        if (sizeof($datos_archivo) === 0) {
            continue;
        }

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        $recuperarID_obj->execute(array("a" . $datos_archivo[0]));
        $IDUsuario = $recuperarID_obj->fetch(PDO::FETCH_ASSOC);
        $recuperarPlan_obj->execute(array($datos_archivo[6], $datos_archivo[7]));
        $IDPlan = $recuperarPlan_obj->fetch(PDO::FETCH_ASSOC);

        $incognitas = array($datos_archivo[0], $datos_archivo[1], $datos_archivo[2], $datos_archivo[3], $IDPlan["IDPlanEstudio"], $datos_archivo[8], $datos_archivo[4], $IDUsuario["IDUsuario"], $datos_archivo[0]);
        $insertar_obj->execute($incognitas);
    }
}
