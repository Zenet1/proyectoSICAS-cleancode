<?php

function RecuperarProfesores(string $carpeta, PDO $Conexion)
{
    $archivo = file("$carpeta/ProfesoresConAlumnosInscritos.txt");
    $saltado = false;

    $sqlInsert = "INSERT INTO academicos (ClaveProfesor, NombreProfesor, ApellidoPaternoProfesor, ApellidoMaternoProfesor, GradoAcademico,CorreoProfesor,IDUsuario) SELECT ?,?,?,?,?,?,? FROM DUAL WHERE NOT EXISTS(SELECT ClaveProfesor FROM academicos WHERE ClaveProfesor=?) LIMIT 1";

    $sqlUsuario = "INSERT INTO usuarios (Cuenta,IDRol) SELECT :cnt,:idr FROM DUAL WHERE NOT EXISTS (SELECT Cuenta FROM usuarios WHERE Cuenta=:cnt) LIMIT 1";

    $sqlIDUsu = "SELECT IDUsuario FROM usuarios WHERE Cuenta=?";

    $objInsert = $Conexion->prepare($sqlInsert);
    $objusuario = $Conexion->prepare($sqlUsuario);
    $objIDusu = $Conexion->prepare($sqlIDUsu);

    foreach ($archivo as $linea) {
        $data = explode("|", utf8_encode(trim($linea)));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        if (sizeof($data) === 1) {
            continue;
        }

        if ($data[6] !== "null") {
            $objusuario->execute(array("cnt" => $data[6], "idr" => 5));
            $objIDusu->execute(array($data[6]));
            $resultado = $objIDusu->fetch(PDO::FETCH_ASSOC);
        } else {
            $resultado["IDUsuario"] = 0;
        }

        $objInsert->execute(array($data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $resultado["IDUsuario"], $data[0]));
    }
}
