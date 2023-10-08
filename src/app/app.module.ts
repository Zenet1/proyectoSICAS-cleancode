import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';

import { DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { app_routing } from './app.routes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { RegistroExternoComponent } from './components/registro-externo/registro-externo.component';
import { CuestionarioComponent } from './components/cuestionario/cuestionario.component';
import { AsistenciaAlumnoComponent } from './components/asistencia-alumno/asistencia-alumno.component';
import { InicioAlumnoComponent } from './components/inicio-alumno/inicio-alumno.component';
import { InicioCapturadorComponent } from './components/inicio-capturador/inicio-capturador.component';
import { InicioAdministradorComponent } from './components/inicio-administrador/inicio-administrador.component';
import { AsistenciaExternoComponent } from './components/asistencia-externo/asistencia-externo.component';
import { AlertaComponent } from './components/administrador/alerta/alerta.component';
import { OficinasExternoComponent } from './components/administrador/oficinas-externo/oficinas-externo.component';
import { GestionRegistrosComponent } from './components/administrador/gestion-registros/gestion-registros.component';
import { CapacidadFacultadComponent } from './components/administrador/capacidad-facultad/capacidad-facultad.component';
import { GestionarSiceiComponent } from './components/administrador/gestionar-sicei/gestionar-sicei.component';
import { EstadisticasComponent } from './components/administrador/estadisticas/estadisticas.component';
import { RegistroUsuariosComponent } from './components/administrador/registro-usuarios/registro-usuarios.component';
import { AulasComponent } from './components/administrador/aulas/aulas.component';
import { CapturaPreguntasComponent } from './components/administrador/captura-preguntas/captura-preguntas.component';
import { InicioPersonalComponent } from './components/inicio-personal/inicio-personal.component';
import { AsistenciaPersonalComponent } from './components/asistencia-personal/asistencia-personal.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ScannerComponent,
    RegistroExternoComponent,
    CuestionarioComponent,
    AsistenciaAlumnoComponent,
    InicioAlumnoComponent,
    InicioCapturadorComponent,
    InicioAdministradorComponent,
    AsistenciaExternoComponent,
    AlertaComponent,
    OficinasExternoComponent,
    GestionRegistrosComponent,
    CapacidadFacultadComponent,
    GestionarSiceiComponent,
    EstadisticasComponent,
    RegistroUsuariosComponent,
    AulasComponent,
    CapturaPreguntasComponent,
    InicioPersonalComponent,
    AsistenciaPersonalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    app_routing,
    ZXingScannerModule,
    NgxChartsModule
  ],
  providers: [DatePipe, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }