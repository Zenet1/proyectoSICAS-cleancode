<?php
session_start();
$FechasPath = realpath(dirname(__FILE__, 3) . "/Clases//Fechas.Class.php");
$ConexionPath = realpath(dirname(__FILE__, 3) . "/Clases/Conexion.Class.php");

include_once($ConexionPath);
include_once($FechasPath);

$conexion = Conexion::ConexionInstacia();
$pdoConexion = $conexion->getConexion();
$fechas = Fechas::ObtenerInstancia();

$sqlRecFacs = "SELECT SiglasFacultad from facultades";
$objFacultades = $pdoConexion->prepare($sqlRecFacs);
$objFacultades->execute();
$resultado = $objFacultades->fetchAll(PDO::FETCH_ASSOC);

foreach ($resultado as $FACULTAD) {
    Conexion::ReconfigurarConexion($FACULTAD["SiglasFacultad"]);
    $DB_CONEXION = Conexion::ConexionInstacia()->getConexion();

    $sql_insertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,TipoCorreo)SELECT :cor,:nom,:asu,:mes,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

    $obj_datosProfesores = $DB_CONEXION->prepare("SELECT ASIG.NombreAsignatura,PLE.NombrePlan,GPS.IDGrupo,ACAD.GradoAcademico, ACAD.NombreProfesor,ACAD.ApellidoPaternoProfesor, ACAD.ApellidoMaternoProfesor, ACAD.CorreoProfesor FROM academicos AS ACAD  INNER JOIN grupos AS GPS ON GPS.IDProfesor=ACAD.IDProfesor INNER JOIN asignaturas AS ASIG ON ASIG.IDAsignatura=GPS.IDAsignatura INNER JOIN planesdeestudio AS PLE ON PLE.IDPlanEstudio=ASIG.IDPlanEstudio");

    $obj_datosAlumnos = $DB_CONEXION->prepare("SELECT ALM.NombreAlumno, ALM.ApellidoPaternoAlumno, ALM.ApellidoMaternoAlumno FROM alumnos AS ALM INNER JOIN cargaacademica AS CGAC ON CGAC.IDAlumno=ALM.IDAlumno INNER JOIN reservacionesalumnos AS RSAL ON RSAL.IDCarga=CGAC.IDCarga WHERE CGAC.IDGrupo=? AND RSAL.FechaReservaAl=? ORDER BY ALM.ApellidoPaternoAlumno,ALM.ApellidoMaternoAlumno");

    $obj_datosProfesores->execute();
    $profesoresCrudos = $obj_datosProfesores->fetchAll(PDO::FETCH_ASSOC);
    $fechahoy = $fechas->FechaAct();
    $asunto = "";
    $mensaje = "";

    if (sizeof($profesoresCrudos) === 0) {
        continue;
    }

    foreach ($profesoresCrudos as $profesor) {
        $obj_datosAlumnos->execute(array($profesor["IDGrupo"], $fechahoy));
        $alumnosCrudos = $obj_datosAlumnos->fetchAll(PDO::FETCH_ASSOC);
        $listaAlumnos = "";

        foreach ($alumnosCrudos as $alumno) {
            $listaAlumnos .= "<li>" . $alumno["ApellidoPaternoAlumno"];
            $listaAlumnos .= " " . $alumno["ApellidoMaternoAlumno"];
            $listaAlumnos .= " " .  $alumno["NombreAlumno"] . "</li>";
        }
        $nombreCompleto = "";
        $nombreCompleto .= $profesor["NombreProfesor"];
        $nombreCompleto .= " " . $profesor["ApellidoPaternoProfesor"];
        $nombreCompleto .= " " . $profesor["ApellidoMaternoProfesor"];

        $asunto = "Lista de alumnos. Asignatura: " . $profesor["NombreAsignatura"];
        $mensaje = "Estimado " . $profesor["GradoAcademico"] . " " . $nombreCompleto . ", a continuacion se le compartirá una lista de los estudiantes que han hecho una reservacion para la fecha " . $fechahoy . " en la asignatura " . $profesor["NombreAsignatura"] . " Plan de estudio: " . $profesor["NombrePlan"] . ".\n<ol>" . $listaAlumnos . "</ol>";

        $conexion::ReconfigurarConexion("CAMPUS");
        $conexion::ConexionInstacia("CAMPUS");
        $PDO = $conexion->getConexion();
        $objInsert = $PDO->prepare($sql_insertar);

        $datosLista = array("cor" => $profesor["CorreoProfesor"], "nom" => $nombreCompleto, "mes" => $mensaje, "asu" => $asunto, "tip" => "Lista");

        $objInsert->execute($datosLista);
    }
}
