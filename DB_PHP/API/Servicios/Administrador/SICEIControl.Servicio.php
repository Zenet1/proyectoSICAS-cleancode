<?php
include_once("./docs/RecuperarAlumnos.php");
include_once("./docs/RecuperarAsignaturas.php");
include_once("./docs/RecuperarCargasAcademicas.php");
include_once("./docs/RecuperarEdificiosLicenciatura.php");
include_once("./docs/RecuperarGrupos.php");
include_once("./docs/EstablecerPorcentaje.php");
include_once("./docs/RecuperarPersonal.php");
include_once("./docs/RecuperarHorarios.php");
include_once("./docs/RecuperarPlanEstudio.php");
include_once("./docs/RecuperarProfesores.php");
include_once("./docs/RecuperarSalones.php");
include_once("./docs/RecuperarUsuariosAlumnos.php");
include_once("./docs/ActualizarAcademicos.php");
include_once("./docs/ActualizarPersonal.php");

class SICEIControl
{
    private PDO $conexion;
    private ArchivoControl $archivos;
    private array $archivosPrinc;
    private bool $personal;

    public function __construct(PDO $conexion, ArchivoControl $archivos)
    {
        $this->personal = false;
        $this->conexion = $conexion;
        $this->archivos = $archivos;
        $this->archivosPrinc = array("AlumnosCargaDeAsignaturas.txt", "AlumnosInscripcionEnPeriodoCurso.txt", "AsignaturasALasQueSeInscribieronAlumnos.txt", "HorariosSesionesGrupo.txt", "PlanesDeEstudios.txt", "ProfesoresConAlumnosInscritos.txt");
    }

    public function TruncarTablas()
    {
        $sqlTruncar =
            "TRUNCATE `academicos`;
        TRUNCATE `alumnos`;
        TRUNCATE `asignaturas`;
        TRUNCATE `cargaacademica`;
        TRUNCATE `edificios`;
        TRUNCATE `grupos`;
        TRUNCATE `horarios`;
        TRUNCATE `oficinas`;
        TRUNCATE `personal`;
        TRUNCATE `planesdeestudio`;
        TRUNCATE `salones`;
        DELETE FROM usuarios WHERE IDRol = 1 OR IDRol = 4 OR IDRol = 5";

        $objTruncar = $this->conexion->prepare($sqlTruncar);
        $objTruncar->execute();
    }

    private function VerificarDatosRespaldo()
    {
        if (sizeof($this->archivosPrinc) > intval($_POST["numArchivos"])) {
            $this->EliminarDatos();
            exit("Cantidad de archivos incorrectos");
        }

        $archivosSubidos = scandir($this->archivos::$carpetaUnica . "/");

        foreach ($this->archivosPrinc as $archivo) {
            if (!in_array($archivo, $archivosSubidos)) {
                $this->EliminarDatos();
                exit("Algun archivo principal falta o el nombre no es posible reconocerlo");
            }

            if (in_array("administrativos.txt", $archivosSubidos)) {
                $this->personal = true;
            }
        }
    }

    public function RestaurarSICEI()
    {
        $this->archivos->MoverArchivos(intval($_POST["numArchivos"]));
        $this->VerificarDatosRespaldo();

        RecuperarUsuariosAlumnos($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarEdificiosLicenciatura($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarSalones($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarPlanEstudio($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarAsignaturas($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarProfesores($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarAlumnos($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarGrupos($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarCargasAcademicas($this->archivos::$carpetaUnica, $this->conexion);
        RecuperarHorarios($this->archivos::$carpetaUnica, $this->conexion);
        InsertarPorcentaje($this->archivos::$carpetaUnica, $this->conexion);

        if ($this->personal) {
            RecuperarPersonal($this->archivos::$carpetaUnica, $this->conexion);
        }
        $this->EliminarDatos();
    }

    public function ActualizarDatos()
    {
        $this->archivos->MoverArchivos(intval($_POST["numArchivos"]));
        $archivosSubidos = scandir($this->archivos::$carpetaUnica . "/");

        foreach ($archivosSubidos as $archivo) {
            switch (basename($archivo, ".txt")) {
                case "academicos":
                    ActualizarPersonal($this->archivos::$carpetaUnica, $this->conexion);
                    break;
                case "ProfesoresConAlumnosInscritos":
                    ActualizarAcademicos($this->archivos::$carpetaUnica, $this->conexion);
                    break;
            }
        }

        $this->EliminarDatos();
    }

    private function EliminarDatos()
    {
        foreach (scandir($this->archivos::$carpetaUnica) as $archivo) {
            if (is_file($this->archivos::$carpetaUnica . "/" . $archivo) && strpos($archivo, ".txt") !== false) {
                unlink($this->archivos::$carpetaUnica . "/" . $archivo);
            }
        }
        rmdir($this->archivos::$carpetaUnica);
    }
}
