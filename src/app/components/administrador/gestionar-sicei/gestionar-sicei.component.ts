import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-gestionar-sicei',
  templateUrl: './gestionar-sicei.component.html',
  styleUrls: ['./gestionar-sicei.component.css']
})
export class GestionarSiceiComponent implements OnInit {
  formularioBDSicei:FormGroup;
  formActualizarDatos:FormGroup;
  constructor(private servicioAdmin:AdministradorService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formularioBDSicei = this.formBuilder.group({
      archivos:[""]
    });
    this.formActualizarDatos = this.formBuilder.group({
      archivosActualizar:[""]
    })
  }

  archivosSeleccionados(event){
    const archivo = event.target.files;
    this.formularioBDSicei.get('archivos').setValue(archivo);
  }

  archivosActualizarSelecccionados(event){
    const archivo = event.target.files;
    this.formActualizarDatos.get('archivosActualizar').setValue(archivo);
  }

  subirBDSicei(){
    this.servicioAdmin.subirBDSicei(this.formularioBDSicei.value).subscribe(
      respuesta=>{
        alert("Se realizó la migración de los datos del SICEI correctamente");
      },
      error=>{
        alert("Ocurrió un error al intentar migrar los datos del SICEI");
      }
    );
  }

  actualizarDatos(){
    this.servicioAdmin.actualizarDatos(this.formActualizarDatos.value).subscribe(
      respuesta=>{
        alert("Se realizó la carga de los datos correctamente");
      },
      error=>{
        alert("Ocurrió un error al intentar subir los datos");
      }
    );
  }

  eliminarDatos(){
    this.servicioAdmin.eliminarDatos().subscribe(
      respuesta=>{
        alert("Se eliminaron los datos correctamente");
      },
      error=>{
        alert("Ocurrió un error al intentar eliminar los datos");
      }
    );
  }
}