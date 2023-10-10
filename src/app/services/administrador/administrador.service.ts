import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  
  API_Administrador:string = 'http://localhost:80/proyectoSICAS-cleancode/DB_PHP/API/Administrador.Ruta.php';
  API_Oficinas:string = 'http://localhost:80/proyectoSICAS-cleancode/DB_PHP/API/Oficinas.Ruta.php';

  constructor(private clienteHttp: HttpClient) { }

  obtenerAfectados(afectados:FormGroup){
    let datos = JSON.stringify({accion:"obtenerAfectados", contenido: afectados});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  alertar(grupos:any, usuarios:any){
    let datos = JSON.stringify({accion:"alertaCOVID", contenido: grupos, usuarios});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  obtenerCapacidadActual(){
    let datos = JSON.stringify({accion: "recuperarPorcentaje"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  guardarCapacidadFacultad(datosCapacidad:FormGroup){
    let datos = JSON.stringify({accion:"actualizarPorcentaje", contenido: datosCapacidad});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  subirBDSicei(datos:any){
    const formData = new FormData();
    let numArchivos:number = 0;
    for (let index = 0; index < datos.archivos.length; index++) {
      numArchivos++;
      formData.append('archivo' + [index], datos.archivos[index]);
    }
    formData.append('numArchivos', numArchivos + "");
    formData.append('accion', "restaurarSICEI");
    return this.clienteHttp.post<any>(this.API_Administrador, formData);
  }

  actualizarDatos(datos:any){
    const formData = new FormData();
    let numArchivos:number = 0;
    for (let index = 0; index < datos.archivosActualizar.length; index++) {
      numArchivos++;
      formData.append('archivo' + [index], datos.archivosActualizar[index]);
    }
    formData.append('numArchivos', numArchivos + "");
    formData.append('accion', "actualizarSICEI");
    return this.clienteHttp.post<any>(this.API_Administrador, formData);
  }

  eliminarDatos(){
    let datos = JSON.stringify({accion:"eliminarSICEI"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  obtenerEdificios(){
    let datos = JSON.stringify({accion: "recuperarEdificios"});
    return this.clienteHttp.post(this.API_Oficinas, datos);
  }

  obtenerOficinas(){
    let datos = JSON.stringify({accion: "recuperarOficinas"});
    return this.clienteHttp.post(this.API_Oficinas, datos);
  }

  guardarOficina(datosOficina:any){
    let datos = JSON.stringify({accion: "agregarOficina", contenido: datosOficina});
    return this.clienteHttp.post<any>(this.API_Oficinas, datos);
  }

  eliminarOficina(idOficina:any){
    let datos = JSON.stringify({accion: "eliminarOficina", contenido: idOficina});
    return this.clienteHttp.post<any>(this.API_Oficinas, datos);
  }

  obtenerAulas(){
    let datos = JSON.stringify({accion:"recuperarSalones"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  guardarAula(datosAula:any){
    let datos = JSON.stringify({accion:"actualizarSalon", contenido: datosAula});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  eliminarAula(id:any){
    return this.clienteHttp.post<any>(this.API_Administrador, id);
  }

  restaurarBD(datos:FormGroup){
    const formData = new FormData();
    formData.append('archivo', datos.get('archivo').value);
    formData.append('accion', 'restaurarSICAS');
    return this.clienteHttp.post<any>(this.API_Administrador, formData);
  }

  eliminarBD(){
    let datos = JSON.stringify({accion:"eliminarSICAS"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  respaldarBD(){
    const someHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let datos = JSON.stringify({accion:"respaldarSICAS"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos, {headers:someHeaders, responseType: 'blob' as 'json'});
  }

  obtenerProgramas(){
    let datos = JSON.stringify({accion:"recuperarPlanes"});
    return this.clienteHttp.post<any>(this.API_Administrador,datos);
  }

  obtenerEstadisticas(filtros:any){
    let tipo = filtros.tipo;
    let datos;
    if(tipo == "asistenciapersonal"){
      datos = JSON.stringify({accion:"recuperarEstadisticaPersonal", contenido: filtros});
    } else {
      datos = JSON.stringify({accion:"recuperarEstadisticaAlumno", contenido: filtros});
    }
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  obtenerRoles(){
    let datos = JSON.stringify({accion:"recuperarRoles"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  registrarUsuario(datosUsuario:any){
    let datos = JSON.stringify({accion:"agregarUsuario", contenido: datosUsuario});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  obtenerPreguntas(){
    let datos = JSON.stringify({accion:"recuperarPreguntas"});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  guardarPreguntas(pregunta:any){
    let datos = JSON.stringify({accion:"agregarPregunta", contenido:pregunta});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }

  eliminarPregunta(id:any){
    let datos = JSON.stringify({accion:"eliminarPregunta", contenido: id});
    return this.clienteHttp.post<any>(this.API_Administrador, datos);
  }
}