<?php
include_once("Alertar.Query.php");

class Alertar
{
    private Query $objQuery;
    private AlertaQuery $objAleQ;
    private CorreoManejador $correo;
    private Fechas $fecha;

    public function __construct(Query $objQuery, CorreoManejador $correo, Fechas $fecha)
    {
        $this->objQuery = $objQuery;
        $this->objAleQ = new AlertaQuery();
        $this->correo = $correo;
        $this->fecha = $fecha;
    }

    public function alertar(array $contenido)
    {
        //print_r($contenido);
    }

    public function obtenerAfectados(array $contenido, Conexion $conexion)
    {
        $listaFechas = $this->obtenerFechas($contenido);

        if (sizeof($listaFechas) === 0) {
            exit();
        }
        $gruposFiltrados = array();
        $alumnosFiltrados = array();
        $profesoresFiltrados = array();

        foreach ($listaFechas as $fecha) {
            $incognitas = array("mat" => $contenido["matricula"], "fch" => $fecha["FechaAl"]);
            $gruposFiltrados = $this->obtenerDatosUnicos($this->objAleQ->CargasAcademicas(), $gruposFiltrados, $incognitas);
        }

        foreach ($gruposFiltrados as $grupo) {
            $incognitaAlumno = array("mat" => $contenido["matricula"], "fch" => $grupo["FechaReservaAl"], "idg" => $grupo["IDGrupo"]);
            $incognitaProfesor = array("idg" => $grupo["IDGrupo"]);

            $alumnosFiltrados = $this->obtenerDatosUnicos($this->objAleQ->ObtenerInvol(), $alumnosFiltrados, $incognitaAlumno);
            $profesoresFiltrados = $this->obtenerDatosUnicos($this->objAleQ->ObtenerProf(), $profesoresFiltrados, $incognitaProfesor);
        }

        $this->EnviarCorreo($profesoresFiltrados, $gruposFiltrados, $conexion);
        $this->EnviarCorreo($alumnosFiltrados, $gruposFiltrados, $conexion);

        $this->insertarIncidentados($contenido["matricula"], $alumnosFiltrados, $contenido["fechaSuspension"], $contenido["fechaSospechosos"]);

        $datosEnviar["usuarios"] = sizeof($profesoresFiltrados) + sizeof($alumnosFiltrados);
        $datosEnviar["grupos"] = $gruposFiltrados;

        echo json_encode($datosEnviar);
    }

    private function obtenerFechas(array $contenido)
    {
        $incognitas = array("mat" => $contenido["matricula"], "fchIn" => $contenido["fechaInicio"], "fchFn" => $contenido["fechaFin"]);
        return $this->objQuery->ejecutarConsulta($this->objAleQ->ObtenerAsistencias(), $incognitas);
    }

    private function obtenerDatosUnicos(string $sql, array $datosFiltrados, array $datos) : array
    {
        $resultado = $this->objQuery->ejecutarConsulta($sql, $datos);
        return $this->filtrar($resultado, $datosFiltrados);
    }

    private function filtrar(array $datoCrudo, array $datosFiltrados)
    {
        foreach ($datoCrudo as $dato) {
            if (!in_array($dato, $datosFiltrados)) {
                $datosFiltrados[] = array_shift($datoCrudo);
            } else {
                array_shift($datoCrudo);
            }
        }
        return $datosFiltrados;
    }

    private function enviarCorreo(array $datosUnicos, array $grupos, Conexion $conexion)
    {
        $sql_insertar = "INSERT INTO correos (correo,nombre,asunto,mensaje,TipoCorreo)SELECT :cor,:nom,:asu,:mes,:tip FROM DUAL WHERE NOT EXISTS (SELECT correo,TipoCorreo FROM correos WHERE correo=:cor AND TipoCorreo=:tip) LIMIT 1";

        $asunto = "Posible contagio";
        $mensaje = "Buen día, el objetivo de este correo es informarle que se ha notificado un caso de COVID 19,";
        $mensaje .= " y se ha determinado que puede estar en riesgo de contagio, ";
        $mensaje .= "debido que se ha detectado que has estado presente en una de las siguientes asignaturas: <ul>";
        $gruposAfectados = "";

        foreach ($grupos as $GRUPO) {
            $gruposAfectados .= "<li>" . $GRUPO["NombreAsignatura"] . "</li><br>";
        }

        $mensaje .= $gruposAfectados . "</ul>";
        $mensaje .= "Se recomienda monitorear su salud por un posible contagio.";

        foreach ($datosUnicos as $DATO) {
            $NombreCompleto = $DATO["NOMBRE"] . " ";
            $NombreCompleto .= $DATO["APELLIDOP"] . " ";
            $NombreCompleto .= $DATO["APELLIDOM"];
        }

        $datosQr = array("mes" => $mensaje, "cor" => trim($DATO["CORREO"]), "nom" => trim($NombreCompleto), "asu" => $asunto, "tip"=> "RA");
        
        $conexion::ReconfigurarConexion("CAMPUS");
        $conexion::ConexionInstacia("CAMPUS");
        $PDO = $conexion->getConexion();
        $objInsert = $PDO->prepare($sql_insertar);
        $objInsert->execute($datosQr);
    }

    private function insertarIncidentados(string $matriculaAlumnoPortador, array $listaAlumnos, string $fechaSuspension, string $fechaSospechosos){
        $this->insertarAlumnoIncidentado($matriculaAlumnoPortador, $fechaSuspension);

        foreach($listaAlumnos as $alumnoSospechoso){
            $this->insertarAlumnoIncidentado($alumnoSospechoso["Matricula"], $fechaSospechosos);
        }
    }

    private function insertarAlumnoIncidentado(string $matricula, string $fechaSuspension) : void
    {
        $IDAlumno = $this->recuperarAlumno($matricula);
        $incognitas = array("ida" => $IDAlumno, "fchA" => $this->fecha->FechaAct(), "fchL" => $fechaSuspension);
        
        $this->objQuery->ejecutarConsulta($this->objAleQ->AgregarIncidente(), $incognitas);
    }

    private function recuperarAlumno(string $matricula) : string
    {
        $sql_recuperarIDAlumno = "SELECT IDAlumno FROM alumnos WHERE Matricula = ?";
        $IDAlumno = $this->objQuery->ejecutarConsulta($sql_recuperarIDAlumno, array($matricula));

        return $IDAlumno[0]["IDAlumno"];
    }
}