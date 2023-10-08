<?php

function RecuperarEdificiosLicenciatura(string $carpeta, PDO $Conexion)
{
    $archivo = file("$carpeta/HorariosSesionesGrupo.txt");
    $saltado = false;

    $sqlInsert = "INSERT INTO edificios (NombreEdificio) SELECT :nome FROM DUAL WHERE NOT EXISTS (SELECT NombreEdificio FROM edificios WHERE NombreEdificio = :nome) LIMIT 1";
    $obj_insert = $Conexion->prepare($sqlInsert);

    $edificios = array();

    foreach ($archivo as $linea) {
        $data = explode("|", utf8_encode(trim($linea)));

        if (!$saltado) {
            $saltado = true;
            continue;
        }

        if (sizeof($data) === 1) {
            continue;
        }

        if (!isset($edificios[$data[9]]) && $data[9] != "" && strpos($data[9], "Edificio") !== false) {
            $edificios[$data[9]] = "si";
            $obj_insert->execute(array("nome" => $data[9]));
        }
    }
    $obj_insert->execute(array("nome" => "N/A"));
}
