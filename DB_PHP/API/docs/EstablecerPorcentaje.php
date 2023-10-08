<?php

function InsertarPorcentaje(string $carpeta,PDO $Conexion)
{
    $sqlPorcentaje = "INSERT INTO porcentajecapacidad (Porcentaje) SELECT ? FROM DUAL WHERE NOT EXISTS (SELECT Porcentaje FROM porcentajecapacidad WHERE IDPorcentaje=1) LIMIT 1";

    $objPor = $Conexion->prepare($sqlPorcentaje);

    $objPor->execute(array(0));
}
