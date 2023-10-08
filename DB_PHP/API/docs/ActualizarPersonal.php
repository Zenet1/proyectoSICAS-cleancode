<?php

function ActualizarPersonal(string $carpeta, PDO $conexion)
{
    $archivo = file("$carpeta/administrativos.txt");
    $saltado = false;

    $sqlBuscarIDper = "SELECT IDUsuario FROM personal WHERE ClavePersonal=?";

    $sqlBuscarIDcuenta = "SELECT IDUsuario FROM usuarios WHERE Cuenta=?";

    $sqlActualizarDatos = "UPDATE personal SET Nombres=?,ApellidoPaterno=?,ApellidoMaterno=?,CorreoPersonal=?,IDUsuario=? WHERE ClavePersonal=?";

    $sqlActualizarCuenta = "UPDATE usuarios SET Cuenta=? WHERE IDUsuario=?";

    $sqlInsertarCuenta = "INSERT INTO usuarios (Cuenta,IDRol) SELECT :cnt,:rol FROM DUAL WHERE NOT EXISTS (SELECT Cuenta FROM usuarios WHERE Cuenta=:cnt) LIMIT 1";

    $objBuscarPER = $conexion->prepare($sqlBuscarIDper);
    $objBuscarUSu = $conexion->prepare($sqlBuscarIDcuenta);
    $objInsertar = $conexion->prepare($sqlInsertarCuenta);
    $objActDatos = $conexion->prepare($sqlActualizarDatos);
    $objActCuenta = $conexion->prepare($sqlActualizarCuenta);

    foreach ($archivo as $linea) {
        $datos = explode("|", trim($linea));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        if (sizeof($datos) === 1) {
            continue;
        }

        if ($datos[2] === "" || $datos[3] === "" || $datos[4] === "") {
            continue;
        }

        $apePat = explode(" ", $datos[1])[0];
        $apeMat = explode(" ", $datos[1])[1];

        $objBuscarPER->execute(array($datos[3]));
        $IDUsuario = $objBuscarPER->fetch(PDO::FETCH_ASSOC);

        if ($datos[4] !== "null" && intval($IDUsuario["IDUsuario"]) === 0) {
            $objInsertar->execute(array("cnt" => $datos[4], "rol" => 4));
            $objBuscarUSu->execute(array($datos[4]));
            $IDUsuario = $objBuscarUSu->fetch(PDO::FETCH_ASSOC);
        }

        //ACTUALIZA UNA CUENTA YA EXISTENTE O NUEVA
        if ($datos[4] !== "null" && intval($IDUsuario["IDUsuario"]) !== 0) {
            $objActCuenta->execute(array($datos[4], $IDUsuario["IDUsuario"]));
        }

        $objActDatos->execute(array($datos[0], $apePat, $apeMat, $datos[2], $IDUsuario["IDUsuario"], $datos[3]));
    }
}
