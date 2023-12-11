import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionController } from 'src/app/cuestionario/infraestruture/QuestionController';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-captura-preguntas',
  templateUrl: './captura-preguntas.component.html',
  styleUrls: ['./captura-preguntas.component.css'],
  providers: [QuestionController],
})
export class CapturaPreguntasComponent implements OnInit {
  formPregunta:FormGroup;
  preguntas: any[] = [];
  esSecundaria:boolean = false;

  constructor(
    private formBuilder:FormBuilder,
    private questionController: QuestionController
  ) { }

  ngOnInit(): void {
    this.formPregunta = this.formBuilder.group({
      tipo:[''],
      pregunta:[''],
      respuesta:[''],
      preguntaEnlace:[''],
    });
    this.obtenerPreguntas();
  }

  trimCampo(campo:any, valor:any){
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formPregunta.controls['pregunta'],this.formPregunta.controls['pregunta'].value);
  }

  async obtenerPreguntas() {
    try {
      const preguntasResponse: any = await this.questionController.getAllQuestions();
      if (preguntasResponse && preguntasResponse.data && Array.isArray(preguntasResponse.data)) {
        this.preguntas = preguntasResponse.data;
        console.log(this.preguntas);
      } else {
        this.preguntas = [];
        console.error('La respuesta no contiene un array de preguntas en el campo "data":', preguntasResponse);
      }
    } catch (error) {
      this.preguntas = [];
      console.error('Error al obtener las preguntas:', error);
    }
  }
  

  cambioTipo(event){
    if(event == 'secundaria'){
      this.esSecundaria = true;
    } else {
      this.esSecundaria = false;
    }
  }

  async guardarPregunta(){
    this.trimForm();
    this.questionController.createQuestion(this.formPregunta.value).then(
      (respuesta) => {
        this.obtenerPreguntas();
        this.formPregunta.reset();
      },
      (error) => {
        alert('Ha ocurrido un error al guardar la pregunta');
      }
    );
  }

  eliminarPregunta(id:any, index:any){
    if (window.confirm('¿Desea eliminar la pregunta?')) {
      this.questionController.deleteQuestion(id).then(
        (respuesta) => {
          this.obtenerPreguntas();
        },
        (error) => {
          alert('Ocurrió un error al eliminar la pregunta');
          console.error('Error al eliminar la pregunta:', error);
        }
      );
    }
  }
}