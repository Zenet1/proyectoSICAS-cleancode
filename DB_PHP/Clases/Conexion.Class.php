<?php

class Conexion
{
    private PDO $conexion;
    private static $ObjConexion;

    public static function ConexionInstacia(string $cabecera = "CAMPUS")
    {
        if (!self::$ObjConexion instanceof self) {
            self::$ObjConexion = new self($cabecera);
        }
        return self::$ObjConexion;
    }

    private function __construct(string $cabecera)
    {
        include_once 'Env.Utileria.php';
        try {
            $this->conexion = new PDO($_ENV[$cabecera], $_ENV['USERNAME'],  $_ENV['PASSWORD']);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            echo $e->getMessage();
            error_log("Error al iniciar la conexion" . $e->getMessage());
        }
    }

    public static function ReconfigurarConexion(string $cabecera = "CAMPUS")
    {
        self::$ObjConexion = new self($cabecera);
    }

    public function getConexion(): PDO
    {
        return $this->conexion;
    }
}
