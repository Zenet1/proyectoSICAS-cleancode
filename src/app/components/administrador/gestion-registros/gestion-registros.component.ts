import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-gestion-registros',
  templateUrl: './gestion-registros.component.html',
  styleUrls: ['./gestion-registros.component.css']
})
export class GestionRegistrosComponent implements OnInit {

  formularioRestaurar:FormGroup;
  siArchivoRespaldado:boolean = false;

  constructor(private servicioAdmin:AdministradorService, private datepipe:DatePipe, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formularioRestaurar = this.formBuilder.group({
      archivo:[""]
    });
  }

  respaldar(){
    let currentDateTime =this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
    const nombreArchivo = "respaldo - " + currentDateTime + ".zip";
    this.servicioAdmin.respaldarBD().subscribe(
      respuesta=>{
        this.gestionarArchivo(respuesta, nombreArchivo);
      }
    );
  }

  gestionarArchivo(respuesta:any, nombreArchivo: string){
    const tipoArchivo = respuesta.type;
    const datosBinarios = [];
    datosBinarios.push(respuesta);
    const carpeta = window.URL.createObjectURL(new Blob(datosBinarios, {type: tipoArchivo}));
    const linkDescarga = document.createElement('a');
    linkDescarga.href = carpeta;
    linkDescarga.setAttribute('download', nombreArchivo);
    linkDescarga.click();
    this.siArchivoRespaldado = true;
  }

  archivoSeleccionado(event){
    const logo = event.target.files[0];
    this.formularioRestaurar.get('archivo').setValue(logo);
  }

  restaurar(){
    if (window.confirm("¿Está seguro que desea restaurar este archivo?")) {
      this.servicioAdmin.restaurarBD(this.formularioRestaurar).subscribe(
        respuesta=>{
          alert("Se restauró el archivo correctamente");
        },
        error=>{
          alert("Ocurrió un error al intentar restaurar los registros");
        }
      );
    }
  }

  eliminar(){
    if (window.confirm("¿Está seguro que desea eliminar los datos de asistencia actuales?")) {
      this.servicioAdmin.eliminarBD().subscribe(
        respuesta=>{
          alert("Se eliminaron los registros correctamente");
        },
        error=>{
          alert("Ocurrió un error al intentar eliminar los registros");
        }
      );
    }
  }
}