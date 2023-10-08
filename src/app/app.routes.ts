import { RouterModule, Routes } from "@angular/router";

import { AuthguardGuardAlumno } from "./services/login/authguardAlumno.guard";
import { AuthguardGuardAdmin } from "./services/login/authguardAdmin.guard";
import { AuthguardGuardCapturador } from "./services/login/authguardCapturador.guard";

import { LoginComponent } from './components/login/login.component';
import { RegistroExternoComponent } from "./components/registro-externo/registro-externo.component";
import { ScannerComponent } from './components/scanner/scanner.component';
import { CuestionarioComponent } from "./components/cuestionario/cuestionario.component";
import { AsistenciaAlumnoComponent } from "./components/asistencia-alumno/asistencia-alumno.component";
import { InicioAlumnoComponent } from "./components/inicio-alumno/inicio-alumno.component";
import { InicioCapturadorComponent } from "./components/inicio-capturador/inicio-capturador.component";
import { InicioAdministradorComponent } from "./components/inicio-administrador/inicio-administrador.component";
import { AsistenciaExternoComponent } from "./components/asistencia-externo/asistencia-externo.component";
import { AlertaComponent } from "./components/administrador/alerta/alerta.component";
import { OficinasExternoComponent } from "./components/administrador/oficinas-externo/oficinas-externo.component";
import { GestionRegistrosComponent } from "./components/administrador/gestion-registros/gestion-registros.component";
import { CapacidadFacultadComponent } from "./components/administrador/capacidad-facultad/capacidad-facultad.component";
import { GestionarSiceiComponent } from "./components/administrador/gestionar-sicei/gestionar-sicei.component";
import { EstadisticasComponent } from "./components/administrador/estadisticas/estadisticas.component";
import { RegistroUsuariosComponent } from "./components/administrador/registro-usuarios/registro-usuarios.component";
import { AulasComponent } from "./components/administrador/aulas/aulas.component";
import { CapturaPreguntasComponent } from "./components/administrador/captura-preguntas/captura-preguntas.component";
import { AuthguardGuardPersonal } from "./services/login/authguardPersonal.guard";
import { InicioPersonalComponent } from "./components/inicio-personal/inicio-personal.component";
import { AsistenciaPersonalComponent } from "./components/asistencia-personal/asistencia-personal.component";

const app_routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'escaneo', component: ScannerComponent, canActivate: [AuthguardGuardCapturador]},
    { path: 'registro-externo', component: RegistroExternoComponent},
    { path: 'cuestionario', component: CuestionarioComponent},
    { path: 'asistencia-alumno', component: AsistenciaAlumnoComponent, canActivate: [AuthguardGuardAlumno]},
    { path: 'asistencia-personal', component: AsistenciaPersonalComponent, canActivate: [AuthguardGuardPersonal]},
    { path: 'asistencia-externo', component: AsistenciaExternoComponent},
    { path: 'inicio-alumno', component: InicioAlumnoComponent, canActivate: [AuthguardGuardAlumno]},
    { path: 'inicio-personal', component: InicioPersonalComponent, canActivate: [AuthguardGuardPersonal]},
    { path: 'inicio-capturador', component: InicioCapturadorComponent, canActivate: [AuthguardGuardCapturador]},
    { path: 'inicio-administrador', component: InicioAdministradorComponent, canActivate:[AuthguardGuardAdmin], children:[
        { path: 'alerta', component: AlertaComponent},
        { path: 'oficinas', component: OficinasExternoComponent},
        { path: 'aulas', component: AulasComponent},
        { path: 'gestion-registros', component: GestionRegistrosComponent},
        { path: 'capacidad-facultad', component: CapacidadFacultadComponent},
        { path: 'gestion-sicei', component: GestionarSiceiComponent},
        { path: 'estadisticas', component:EstadisticasComponent},
        { path: 'registro-usuarios', component: RegistroUsuariosComponent},
        { path: 'cuestionario', component: CapturaPreguntasComponent}
    ]},
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
]

export const app_routing = RouterModule.forRoot(app_routes);