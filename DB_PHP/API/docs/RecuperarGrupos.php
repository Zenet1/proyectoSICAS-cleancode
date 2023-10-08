<?php

function RecuperarGrupos(string $carpeta, PDO $Conexion)
{
    $archivo = file("$carpeta/AlumnosCargaDeAsignaturas.txt");
    $saltado = false;

    $sqlInsert = "INSERT INTO grupos (IDAsignatura, IDProfesor, ClaveGrupo, Grupo) SELECT :ida,:idP,:clG,:gP FROM DUAL WHERE NOT EXISTS (SELECT IDAsignatura, IDProfesor, ClaveGrupo, Grupo FROM grupos WHERE IDProfesor=:idP AND ClaveGrupo=:clG AND Grupo=:gP AND IDAsignatura=:ida)LIMIT 1";

    $sqlrecuperarIDPlanAsig = "SELECT IDPlanEstudio FROM planesdeestudio WHERE ClavePlan=? AND VersionPlan=?";
    $sqlrecuperarIDAsig = "SELECT IDAsignatura FROM asignaturas WHERE ClaveAsignatura=? AND IDPlanEstudio = ?";
    $sqlrecuperarIprof = "SELECT IDProfesor FROM academicos WHERE ClaveProfesor=?";

    //Objetos de recuperación
    $obj_recuperarIDPlanAsig = $Conexion->prepare($sqlrecuperarIDPlanAsig);
    $obj_recuperarAsig = $Conexion->prepare($sqlrecuperarIDAsig);

    $obj_recuperarIprof = $Conexion->prepare($sqlrecuperarIprof);
    $obj_insert = $Conexion->prepare($sqlInsert);

    $grupos = array();

    foreach ($archivo as $linea) {
        $data = explode("|", utf8_decode(trim($linea)));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        if (sizeof($data) === 1) {
            continue;
        }

        $obj_recuperarIDPlanAsig->execute(array($data[1], $data[2]));
        $IDPlan = $obj_recuperarIDPlanAsig->fetch(PDO::FETCH_ASSOC);

        $obj_recuperarAsig->execute(array($data[3], $IDPlan["IDPlanEstudio"]));
        $obj_recuperarIprof->execute(array($data[4]));

        $IDasig = $obj_recuperarAsig->fetch(PDO::FETCH_ASSOC);
        $IDprof = $obj_recuperarIprof->fetch(PDO::FETCH_ASSOC);

        $incognitas = array("ida" => $IDasig["IDAsignatura"], "idP" => $IDprof["IDProfesor"], "clG" => $data[5], "gP" => $data[6]);
        
        $obj_insert->execute($incognitas);
    }
}
