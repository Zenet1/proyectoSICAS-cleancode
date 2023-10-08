import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  API: string = '/DB_PHP/API/Usuarios.Ruta.php';
  API_Alumnos: string = '/DB_PHP/API/Alumnos.Ruta.php';
  API_Facultades:string = '/DB_PHP/API/Servicios/Facultades.Servicio.php';
  redirectUrl: string;

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient:HttpClient, private router:Router) { }

  public iniciarSesion(datosCuenta:FormGroup, accionRol:any) {
    var datos = JSON.stringify({accion:accionRol, cuenta:datosCuenta});
    this.httpClient.post<any>(this.API, datos).subscribe(Users => {
      if(Users != null && Users != "Sin cuenta valida"){
        var token = JSON.stringify(Users);
        if(Users.Rol == "Alumno"){
          var accion = JSON.stringify({accion:"comprobarSuspension"});
          this.httpClient.post<any>(this.API_Alumnos, accion).subscribe(
            respuesta=>{
              if(respuesta.length != 0){
                alert("Actualmente no puedes asistir a la facultad debido a que te encuentras suspendido");
              } else {
                this.setToken(token);
                this.getLoggedInName.emit(true);
                location.href = '#/inicio-alumno';
              }
            }
          );
        } else {
          this.setToken(token);
          this.getLoggedInName.emit(true);
          switch(Users.Rol) { 
            case "Profesor":{
              location.href = '#/inicio-personal';
              break;
            }
            case "Personal":{
              location.href = '#/inicio-personal';
              break;
            }
            case "Administrador": { 
              location.href = '#/inicio-administrador';
              break; 
            }
            case "Capturador":{
              location.href = '#/inicio-capturador';
              break;
            }
          } 
        }
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    });
  }

  obtenerFacultades(){
    let datos = JSON.stringify({accion:"recuperarFacultades"});
    return this.httpClient.post<any>(this.API_Facultades, datos);
  }

  getUsuario(){
    return JSON.parse(sessionStorage.getItem('usuario')).Cuenta;
  }

  getRol(){
    return JSON.parse(sessionStorage.getItem('usuario')).Rol;
  }
  
  setToken(token:string) {
    sessionStorage.setItem('usuario', token);
  }
  
  getToken() {
    return sessionStorage.getItem('usuario');
  }
  
  deleteToken() {
    sessionStorage.removeItem('usuario');
  }
  
  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return true
    }
    return false;
  }
}