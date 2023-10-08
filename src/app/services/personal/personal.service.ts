import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  API_Personal: string = '/DB_PHP/API/Personal.Ruta.php';

  constructor(private clienteHttp: HttpClient) { }
  
  enviarAsistencia(usuario:any,rol:any):Observable<any>{
    let datos = JSON.stringify({accion: "insertarReservaPersonal", contenido: {usuario,rol}});
    return this.clienteHttp.post<any>(this.API_Personal, datos);
  }

  combrobarReservacion(rol:any){
    let datos = JSON.stringify({accion: "validacionReservaPersonal", contenido: rol});
    return this.clienteHttp.post(this.API_Personal, datos);
  }
}