import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  API_Preguntas:string = 'http://localhost:80/proyectoSICAS-cleancode/DB_PHP/API/Cuestionario.Ruta.php';

  constructor(private clienteHttp: HttpClient) { }

  obtenerPreguntas(){
    let datos  = JSON.stringify({accion: "recuperarPreguntas"});
    return this.clienteHttp.post(this.API_Preguntas, datos);
  }

  rechazado():Observable<any>{
    let datos  = JSON.stringify({accion: "enviarCorreo"});
    return this.clienteHttp.post<any>(this.API_Preguntas, datos);
  }
}