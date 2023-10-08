import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-oficinas-externo',
  templateUrl: './oficinas-externo.component.html',
  styleUrls: ['./oficinas-externo.component.css']
})
export class OficinasExternoComponent implements OnInit {
  formOficina:FormGroup;
  oficinas:any;
  edificios:any;

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formOficina = this.formBuilder.group({
        oficina: [""],
        departamento:[""],
        edificio:[""]
      }
    );
    this.obtenerEdificios();
    this.obtenerOficinas();
  }

  trimCampo(campo:any, valor:any){
    var textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formOficina.controls["oficina"],this.formOficina.controls["oficina"].value);
    this.trimCampo(this.formOficina.controls["departamento"],this.formOficina.controls["departamento"].value);
  }

  obtenerOficinas(){
    this.servicioAdmin.obtenerOficinas().subscribe(
      respuesta=>{
        this.oficinas = respuesta;
      }
    );
  }

  obtenerEdificios(){
    this.servicioAdmin.obtenerEdificios().subscribe(
      respuesta=>{
        this.edificios = respuesta;
      }
    );
  }

  guardarOficina(){
    this.trimForm();
    this.servicioAdmin.guardarOficina(this.formOficina.value).subscribe(
      respuesta=>{
        this.oficinas = this.obtenerOficinas();
        this.formOficina.reset();
      }
    );
  }

  eliminarOficina(id:any, indexOficina:any){
    if (window.confirm("¿Desea eliminar la oficina?")) {
      this.servicioAdmin.eliminarOficina(id).subscribe(
        respuesta=>{
          this.oficinas.splice(indexOficina,1);
        },
        error=>{
          alert("Ocurrió un error al eliminar la oficina");
        }
      );
    }
  }

}
