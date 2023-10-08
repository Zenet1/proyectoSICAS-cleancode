<?php
class RegistroExterno{

    public function inicializarSesionExterno($datos)
    {
        session_start();
        $_SESSION['Nombre'] = "$datos->nombre";
        $_SESSION['ApellidosExterno'] = "$datos->apellidos";
        $_SESSION['Empresa'] = "$datos->empresa";
        $_SESSION['Correo'] = "$datos->correo";
        $_SESSION['Conexion'] = "$datos->facultad";
    }
}
?>