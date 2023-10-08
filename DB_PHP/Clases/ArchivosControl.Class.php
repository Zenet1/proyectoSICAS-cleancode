<?php
class ArchivoControl
{
    public static string $carpetaUnica;

    public function __construct(Fechas $fechaObj, bool $crearCapeta = true)
    {
        $carpetaRaiz = realpath(dirname(__FILE__, 2) . "/API/backups/") . "/";
        error_log($carpetaRaiz);
        self::$carpetaUnica = $carpetaRaiz . $fechaObj->FechaAct() . "-" . $fechaObj->HrAct("i-s");
        mkdir(self::$carpetaUnica);
    }

    public function MoverArchivo(string $PATH): string
    {
        $direccion = $PATH . $_FILES["archivo"]["name"];
        move_uploaded_file($_FILES["archivo"]["tmp_name"], $direccion);
        return $direccion;
    }

    public function MoverArchivos(int $CANTARCHIVOS)
    {
        for ($i = 0; $i < $CANTARCHIVOS; $i++) {
            $direccion = self::$carpetaUnica . "/" . $_FILES["archivo" . $i]["name"];
            move_uploaded_file($_FILES["archivo" . $i]["tmp_name"], $direccion);
        }
    }

    public function EliminarArchivos(string $PATH, string $extension)
    {
        foreach (scandir($PATH) as $archivo) {
            $direccion = $PATH . "/" . $archivo;
            if (is_file($direccion) && strpos($direccion, $extension)) {
                unlink($direccion);
            }
        }
    }

    public function descargarArchivos(String $NombreZip, string $PATH, string $extension)
    {
        $direccionZip = $PATH . $NombreZip . ".zip";
        $archivoZip = new ZipArchive();
        if ($archivoZip->open($direccionZip, ZipArchive::CREATE) === true) {
            foreach (scandir($PATH) as $archivo) {
                $direccion = $PATH . $archivo;
                if (is_file($direccion) && strpos($archivo, $extension) !== false) {
                    $archivoZip->addFile($direccion);
                }
            }
        }
        $archivoZip->close();
        $this->Descargar($direccionZip);
    }

    private function descargar(string $nombreArchivo)
    {
        header('Content-Description: File Transfer');
        header('Content-Type: application/text');
        header('Content-Disposition: attachment; filename="' . basename($nombreArchivo . ".zip") . '"');
        header('Content-Length: ' . filesize($nombreArchivo));
        readfile($nombreArchivo);
    }
}
