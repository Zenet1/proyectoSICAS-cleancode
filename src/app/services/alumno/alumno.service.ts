import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  API_Alumnos: string = '/DB_PHP/API/Alumnos.Ruta.php';
  
  constructor(private clienteHttp: HttpClient) { }

  enviarAsistencia(datosClases:any):Observable<any>{
    let datos = JSON.stringify({accion: "insertarReservas", contenido: datosClases});
    return this.clienteHttp.post<any>(this.API_Alumnos, datos);
  }

  obtenerClases(){
    let datos = JSON.stringify({accion: "obtenerClases"})
    return this.clienteHttp.post<any>(this.API_Alumnos, datos);
  }

  combrobarReservacion(){
    let datos = JSON.stringify({accion: "validacionReservas"});
    return this.clienteHttp.post(this.API_Alumnos, datos);
  }
}
