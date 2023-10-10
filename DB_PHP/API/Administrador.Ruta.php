<?php

include_once("Servicios/Administrador/ActualizarPorcentaje.Servicio.php");
include_once("Servicios/Administrador/ActualizarSalones.Servicio.php");
include_once("Servicios/Administrador/InsertarUsuario.Servicio.php");
include_once("Servicios/Administrador/ControlBD.Servicio.php");
include_once("Servicios/Administrador/Roles.Servicio.php");
include_once("Servicios/Administrador/RecuperarPlanes.Servicio.php");
include_once("Servicios/Administrador/SICEIControl.Servicio.php");
include_once("Servicios/Administrador/Alertar.Servicio.php");
include_once("Servicios/Administrador/Estadisticas.Servicio.php");
include_once("Servicios/Administrador/Pregunta.Servicio.php");
include_once("../Clases/Conexion.Class.php");
include_once("../Clases/Query.Class.php");
include_once("../Clases/Fechas.Class.php");
include_once("../Clases/Email.Class.php");
include_once("../Clases/ArchivosControl.Class.php");

$datos = null;
$accion = null;

if (isset($_POST) && sizeof($_POST) > 0) {
    $accion = $_POST["accion"];
} else {
    $json = file_get_contents('php://input');
    $datos = json_decode($json);
    $accion = $datos->accion;
    print_r($accion);
}

if(session_status() !== PHP_SESSION_ACTIVE){
    session_id($datos->cuenta);
    session_start();
}

$Conexion = Conexion::ConexionInstacia($_SESSION["Conexion"]);
Conexion::ReconfigurarConexion($_SESSION["Conexion"]);
$Fechas = Fechas::ObtenerInstancia();
$QueryObj = new Query();
$PlanesControl = new PlanesControl($QueryObj);
$RolesControl = new Roles($QueryObj);
$PorcentajeControl = new Porcentaje($QueryObj);
$SalonesControl = new Salones($QueryObj);
$BDControl = new ControlBD($QueryObj);
$EstadisticaControl = new EstadisticaControl($QueryObj);
$NUsuarios = new InsertarUsuario($QueryObj);
$PreguntaControl = new Pregunta($QueryObj);
$AlertaControl = new Alertar($QueryObj, new CorreoManejador(), $Fechas);

switch ($accion) {
    case "agregarUsuario":
        $NUsuarios->InsertarNuevoTrabajador((array)$datos->contenido);
        break;
    case "recuperarPorcentaje":
        $PorcentajeControl->RecuperarPorcentaje();
        break;
    case "actualizarPorcentaje":
        $PorcentajeControl->ActualizarPorcentaje((array) $datos->contenido);
        break;
    case "recuperarSalones":
        $SalonesControl->ObtenerSalones();
        break;
    case "actualizarSalon":
        $SalonesControl->ActualizarSalon((array)$datos->contenido);
        break;
    case "respaldarSICAS":
        $BDControl->Respaldar(new ArchivoControl($Fechas), $Fechas);
        break;
    case "eliminarSICAS":
        $BDControl->EliminarBD($Fechas);
        break;
    case "restaurarSICAS":
        $BDControl->Restaurar(new ArchivoControl($Fechas));
        break;
    case "recuperarEstadisticaAlumno":
        $EstadisticaControl->EstadisticasAlumno((array) $datos->contenido);
        break;
    case "recuperarEstadisticaPersonal":
        $EstadisticaControl->EstadisticasPersonal((array) $datos->contenido);
        break;
    case "alertaCOVID":
        $AlertaControl->Alertar((array) $datos->contenido);
        break;
    case "recuperarPreguntas":
        $PreguntaControl->recuperarPreguntas();
        break;
    case "agregarPregunta":
        $PreguntaControl->insertarPregunta((array)$datos->contenido);
        break;
    case "eliminarPregunta":
        $PreguntaControl->eliminarPregunta((array)$datos->contenido);
        break;
    case "recuperarRoles":
        $RolesControl->RecuperarRoles();
        break;
    case "recuperarPlanes":
        $PlanesControl->RecuperarPlanesEstudio();
        break;
    case "obtenerAfectados":
        Conexion::ReconfigurarConexion("CAMPUS");
        $AlertaControl->obtenerAfectados((array) $datos->contenido, Conexion::ConexionInstacia("CAMPUS"));
        break;
    case "restaurarSICEI":
        $SICEIControl = new SICEIControl($Conexion->getConexion(), new ArchivoControl($Fechas, false));
        $SICEIControl->RestaurarSICEI();
        break;
    case "actualizarSICEI":
        $SICEIControl = new SICEIControl($Conexion->getConexion(), new ArchivoControl($Fechas, false));
        $SICEIControl->ActualizarDatos();
        break;
    case "eliminarSICEI":
        $SICEIControl = new SICEIControl($Conexion->getConexion(), new ArchivoControl($Fechas, false));
        $SICEIControl->TruncarTablas();
        break;
}
