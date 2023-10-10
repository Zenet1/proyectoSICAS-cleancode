import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CapturadorService {

  API:string = "http://localhost:80/proyectoSICAS-cleancode/DB_PHP/API/Escaneador.Ruta.php";

  constructor(private clienteHttp: HttpClient) { }

  verficar(escaneo:string){
    let datos = JSON.stringify({accion: "registrarAsistencia", contenido: escaneo});
    return this.clienteHttp.post<any>(this.API, datos);
  }
}