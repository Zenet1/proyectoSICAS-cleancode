<?php

function RecuperarHorarios(string $carpeta,PDO $Conexion)
{
    $archivo = file("$carpeta/HorariosSesionesGrupo.txt");
    $saltado = false;

    $sqlInsert = "INSERT INTO horarios (IDGrupo, Dia, HoraInicioHorario, HoraFinHorario, IDSalon) SELECT :idG, :dia, :hri, :hrf, :ids FROM DUAL WHERE NOT EXISTS (SELECT IDGrupo, Dia FROM horarios WHERE IDGrupo=:idG AND Dia=:dia) LIMIT 1";

    $sqlrecuperarIDProfesor = "SELECT IDProfesor FROM academicos WHERE ClaveProfesor=?";

    $sqlrecuperarIDPlanAsig = "SELECT IDPlanEstudio FROM planesdeestudio WHERE ClavePlan=? AND VersionPlan=?";
    $sqlrecuperarIDAsignatura = "SELECT IDAsignatura FROM asignaturas WHERE ClaveAsignatura=? AND IDPlanEstudio=?";

    $sqlrecuperarIDGrupo = "SELECT IDGrupo FROM grupos WHERE ClaveGrupo=? AND IDProfesor=? AND IDAsignatura=?";

    $sqlrecuperarEdificio = "SELECT IDEdificio FROM edificios WHERE NombreEdificio=?";
    $sqlrecuperarSalon = "SELECT IDSalon FROM salones WHERE NombreSalon=? AND IDEdificio=?";

    //Objetos de recuperación
    $obj_recuperarIDProfesor = $Conexion->prepare($sqlrecuperarIDProfesor);

    $obj_recuperarIDPlanAsig = $Conexion->prepare($sqlrecuperarIDPlanAsig);
    $obj_recuperarIDAsignatura = $Conexion->prepare($sqlrecuperarIDAsignatura);

    $obj_recuperarIDGrupo = $Conexion->prepare($sqlrecuperarIDGrupo);

    $obj_recuperarEdificio = $Conexion->prepare($sqlrecuperarEdificio);
    $obj_recuperarSalon = $Conexion->prepare($sqlrecuperarSalon);

    $obj_insert = $Conexion->prepare($sqlInsert);

    foreach ($archivo as $linea) {
        $data = explode("|", utf8_encode(trim($linea)));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        
        if (sizeof($data) === 1) {
            continue;
        }
        
        $obj_recuperarEdificio->execute(array($data[9]));
        $IDEdificio = $obj_recuperarEdificio->fetch(PDO::FETCH_ASSOC);

        if (isset($IDEdificio["IDEdificio"])) {
            $obj_recuperarIDProfesor->execute(array($data[3]));
            $IDProfesor = $obj_recuperarIDProfesor->fetch(PDO::FETCH_ASSOC);

            $obj_recuperarIDPlanAsig->execute(array($data[0], $data[1]));
            $IDPlanAsignatura = $obj_recuperarIDPlanAsig->fetch(PDO::FETCH_ASSOC);
            $obj_recuperarIDAsignatura->execute(array($data[2], $IDPlanAsignatura["IDPlanEstudio"]));
            
            $IDAsignatura = $obj_recuperarIDAsignatura->fetch(PDO::FETCH_ASSOC);
            $obj_recuperarIDGrupo->execute(array($data[4], $IDProfesor["IDProfesor"], $IDAsignatura["IDAsignatura"]));

            $obj_recuperarSalon->execute(array(trim($data[10]), $IDEdificio["IDEdificio"]));
            $IDGrupo = $obj_recuperarIDGrupo->fetch(PDO::FETCH_ASSOC);
            $IDSalon = $obj_recuperarSalon->fetch(PDO::FETCH_ASSOC);
            if (isset($IDSalon["IDSalon"]) && isset($IDGrupo["IDGrupo"])) {
                $incognitas = array("idG" => $IDGrupo["IDGrupo"], "dia" => $data[6], "hri" => $data[7], "hrf" => $data[8], "ids" => $IDSalon["IDSalon"]);
                $obj_insert->execute($incognitas);
            }
        }
    }
}
