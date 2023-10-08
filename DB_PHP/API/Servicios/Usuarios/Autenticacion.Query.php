<?php

class AutentcacionQuery
{
    private string $SELECTVerificar;
    private string $SELECTProfesor;
    private string $SELECTPersonal;
    private string $SELECTDatosAl;
    private string $UPDATECuenta;

    public function __construct()
    {
        $this->SELECTVerificar = "SELECT us.IDUsuario,us.IDRol,us.Cuenta,ro.IDRol,ro.Rol FROM usuarios AS us INNER JOIN roles AS ro ON ro.IDRol=us.IDRol WHERE us.Cuenta=:ctn AND us.Contraseña=:pss";

        $this->SELECTDatosAl = "SELECT IDAlumno,NombreAlumno,ApellidoPaternoAlumno,ApellidoMaternoAlumno,Matricula,CorreoAlumno FROM alumnos WHERE IDUsuario=:idu";

        $this->SELECTProfesor = "SELECT IDProfesor AS ID,CorreoProfesor AS CORREO,NombreProfesor AS NOMBRE,ApellidoPaternoProfesor AS APP FROM academicos WHERE IDUsuario=:idu";

        $this->UPDATECuenta = "UPDATE usuarios SET Contraseña=? WHERE Cuenta=?";

        $this->SELECTPersonal = "SELECT CorreoPersonal AS CORREO, IDPersonal AS ID,Nombres AS NOMBRE,ApellidoPaterno AS APP FROM personal WHERE IDUsuario=:idu";
    }

    public function VerificarLocal(): string
    {
        return $this->SELECTVerificar;
    }

    public function DatosAlumno(): string
    {
        return $this->SELECTDatosAl;
    }

    public function DatosProfesor(): string
    {
        return $this->SELECTProfesor;
    }

    public function DatosPersonal(): string
    {
        return $this->SELECTPersonal;
    }

    public function ActualizarCuenta(): string
    {
        return $this->UPDATECuenta;
    }
}
