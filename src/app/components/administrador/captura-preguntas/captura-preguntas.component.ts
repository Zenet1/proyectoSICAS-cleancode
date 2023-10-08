import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-captura-preguntas',
  templateUrl: './captura-preguntas.component.html',
  styleUrls: ['./captura-preguntas.component.css']
})
export class CapturaPreguntasComponent implements OnInit {
  formPregunta:FormGroup;
  preguntas:any;
  esSecundaria:boolean = false;

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formPregunta = this.formBuilder.group({
      tipo:[""],
      pregunta:[""],
      respuesta:[""],
      preguntaEnlace:[""]
    });
    this.obtenerPreguntas();
  }

  trimCampo(campo:any, valor:any){
    var textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formPregunta.controls["pregunta"],this.formPregunta.controls["pregunta"].value);
  }

  obtenerPreguntas(){
    this.servicioAdmin.obtenerPreguntas().subscribe(
      respuesta=>{
        this.preguntas = respuesta;
      }
    );
  }

  cambioTipo(event){
    if(event == "secundaria"){
      this.esSecundaria = true;
    } else {
      this.esSecundaria = false;
    }
  }

  guardarPregunta(){
    this.trimForm();
    this.servicioAdmin.guardarPreguntas(this.formPregunta.value).subscribe(
      respuesta=>{
        this.obtenerPreguntas();
        this.formPregunta.reset();
      },
      error=>{
        alert("Ha ocurrido un error al guardar la pregunta");
      }
    );
  }

  eliminarPregunta(id:any, index:any){
    if (window.confirm("¿Desea eliminar la pregunta?")) {
      this.servicioAdmin.eliminarPregunta(id).subscribe(
        respuesta=>{
          this.obtenerPreguntas();
        },
        error=>{
          alert("Ocurrió un error al eliminar la pregunta");
        }
      );
    }
  }
}