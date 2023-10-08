<?php

function ActualizarAcademicos(string $carpeta, PDO $conexion)
{

    $archivo = file("$carpeta/ProfesoresConAlumnosInscritos.txt");
    $saltado = false;

    $sqlBuscarIDAcad = "SELECT IDUsuario FROM academicos WHERE ClaveProfesor=?";

    $sqlBuscarIDUsu = "SELECT IDUsuario FROM usuarios WHERE Cuenta=?";

    $sqlActualizarDatos = "UPDATE academicos SET NombreProfesor=?,ApellidoPaternoProfesor=?,ApellidoMaternoProfesor=?,GradoAcademico=?,CorreoProfesor=?,IDUsuario=? WHERE ClaveProfesor=?";

    $sqlActualizarCuenta = "UPDATE usuarios SET Cuenta=? WHERE IDUsuario=?";

    $sqlInsertarCuenta = "INSERT INTO usuarios (Cuenta,IDRol) SELECT :cnt,:rol FROM DUAL WHERE NOT EXISTS (SELECT Cuenta FROM usuarios WHERE Cuenta=:cnt) LIMIT 1";

    $objBuscarACAD = $conexion->prepare($sqlBuscarIDAcad);
    $objBuscarUSu = $conexion->prepare($sqlBuscarIDUsu);
    $objInsertar = $conexion->prepare($sqlInsertarCuenta);
    $objActDatos = $conexion->prepare($sqlActualizarDatos);
    $objActCuenta = $conexion->prepare($sqlActualizarCuenta);

    foreach ($archivo as $linea) {

        $datos = explode("|", trim($linea));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        $objBuscarACAD->execute(array($datos[0]));
        $IDUsuario = $objBuscarACAD->fetch(PDO::FETCH_ASSOC);
        
        //INSERTA UNA NUEVA CUENTA
        if ($datos[6] !== "null" && intval($IDUsuario["IDUsuario"]) === 0) {
            $objInsertar->execute(array("cnt" => $datos[6], "rol" => 5));
            $objBuscarUSu->execute(array($datos[6]));
            $IDUsuario = $objBuscarUSu->fetch(PDO::FETCH_ASSOC);
        }

        //ACTUALIZA UNA CUENTA YA EXISTENTE O NUEVA
        if ($datos[6] !== "null" && intval($IDUsuario["IDUsuario"]) !== 0) {
            $objActCuenta->execute(array($datos[6], $IDUsuario["IDUsuario"]));
        }

        $objActDatos->execute(array($datos[1], $datos[2], $datos[3], $datos[4], $datos[5], $IDUsuario["IDUsuario"], $datos[0]));
    }
}
