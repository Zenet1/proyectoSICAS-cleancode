<?php

class InsertarUsuarioQuery
{
    private string $INSERTUsuario;
    private string $SELECTIDUsuario;
    private array $INSERTTrabajador;

    public function __construct()
    {
        $this->SELECTIDUsuario = "SELECT IDUsuario FROM usuarios WHERE Cuenta=:ctn";

        $this->INSERTUsuario = "INSERT INTO usuarios (Cuenta,Contraseña,IDRol) SELECT :ctn,:pss,:idr FROM DUAL WHERE NOT EXISTS (SELECT Cuenta FROM usuarios WHERE Cuenta=:ctn) LIMIT 1";

        $this->INSERTTrabajador["2"] = "INSERT INTO capturadores (IDUsuario,NombreCapt,ApellidoPaternoCapt, ApellidoMaternoCapt) SELECT :idu,:nm,:app,:apm FROM DUAL WHERE NOT EXISTS (SELECT IDUsuario FROM capturadores WHERE IDUsuario=:idu) LIMIT 1";

        $this->INSERTTrabajador["3"] = "INSERT INTO administradores (IDUsuario, NombreAdmin, ApellidoPaternoAdmin, ApellidoMaternoAdmin) SELECT :idu,:nm,:app,:apm FROM DUAL WHERE NOT EXISTS (SELECT IDUsuario FROM administradores WHERE IDUsuario=:idu) LIMIT 1";
    }

    public function SELECTIDusuarioQuery(): string
    {
        return $this->SELECTIDUsuario;
    }

    public function INSERTTRABQuery(int $idRol): string
    {
        return $this->INSERTTrabajador[$idRol];
    }

    public function INSERTusuarioQuery(): string
    {
        return $this->INSERTUsuario;
    }
}
