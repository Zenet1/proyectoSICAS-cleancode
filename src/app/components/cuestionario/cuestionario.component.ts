import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionController } from 'src/app/cuestionario/infraestruture/QuestionController';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
  providers: [QuestionController],
  
})
export class CuestionarioComponent implements OnInit {
  cuestionario:FormGroup;
  estaLogueado:boolean;
  pregPrimarias:any;
  pregSecundarias:any;
  banderas:boolean[] = [];
  
  constructor(
    private cd:ChangeDetectorRef,
    private servicioLogin:LoginService, 
    private servicioCookie:CookieService, 
    private formBuilder: FormBuilder, 
    private router:Router,
    private questionController: QuestionController) {
    this.cuestionario = this.formBuilder.group({
      preguntas: this.formBuilder.array([]),
      preguntasSecundarias: this.formBuilder.array([]), 
    });
  }

  ngOnInit(): void {
    
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    if(this.estaLogueado){
      switch(this.servicioLogin.getRol()) {
      case 'Administrador': { 
        this.router.navigateByUrl('inicio-administrador');
        break;
      }
      case 'Capturador':{
        this.router.navigateByUrl('inicio-capturador');
        break;
      }
      case 'Alumno':{
        this.obtenerPreguntas();
        break;
      }
      case 'Profesor':{
        this.obtenerPreguntas();
        break;
      }
      case 'Personal':{
        this.obtenerPreguntas();
        break;
      }
      }
    } else {
      if(!this.servicioCookie.checkCookie('registroExterno')){
        this.router.navigateByUrl('login');
      } else {
        this.obtenerPreguntas();
      }
    }
  }

  async obtenerPreguntas(){
    await this.questionController.getAllQuestions().then((respuesta: any) => {
      if (respuesta && respuesta.data && Array.isArray(respuesta.data)) {
        this.pregPrimarias = respuesta.data.filter((pregunta: any) => pregunta.Enlace === null);
        this.pregSecundarias = respuesta.data.filter((pregunta: any) => pregunta.Enlace !== null);
        this.agregarCamposPreguntas(this.pregPrimarias.length, this.preguntasForm);
        this.agregarCamposPreguntas(this.pregSecundarias.length, this.pregSecundariasForm);
        for (let index = 0; index < this.pregPrimarias.length; index++) {
          this.banderas.push(false);
        }
      } else {
        console.error('La estructura de datos no es la esperada:', respuesta);
      }
    }).catch((error) => {
      console.error('Error fetching questions:', error);
    });
  }
  
  
  agregarCamposPreguntas(cantidad:any, campo:any){
    for (let index = 0; index < cantidad; index++) {
      const preguntaFormGroup = this.formBuilder.group({
        respuesta:[''],
      });
      campo.push(preguntaFormGroup);
    }
  }

  get preguntasForm(){
    return this.cuestionario.get('preguntas') as FormArray;
  }

  get pregSecundariasForm(){
    return this.cuestionario.get('preguntasSecundarias') as FormArray;
  }

  eleccion(event, i){
    if(this.pregPrimarias[i].Respuesta != event){
      this.banderas[i] = true;
    } else {
      this.banderas[i] = false;
    }
    this.cd.detectChanges();
  }

  enviar(){
    if (window.confirm('Si está seguro de sus respuestas, confirme para continuar')) {
      let cantidadIncorrecta:number = 0;
      let tieneSecundarias:boolean = false;
      for (let index = 0; index < this.preguntasForm.length; index++) {
        if(this.preguntasForm.controls[index].get('respuesta').value != this.pregPrimarias[index].Respuesta){
          for (let j = 0; j < this.pregSecundariasForm.length; j++) {
            if(this.pregSecundarias[j].Enlace  == this.pregPrimarias[index].IDPregunta){
              tieneSecundarias = true;
              if(this.pregSecundariasForm.controls[j].get('respuesta').value  != ''){
                if(this.pregSecundariasForm.controls[j].get('respuesta').value != this.pregSecundarias[j].Respuesta){
                  cantidadIncorrecta++;
                }
              }
            }
          }
          if(!tieneSecundarias){
            cantidadIncorrecta++;
          }
        }
        tieneSecundarias = false;
      }

      if(cantidadIncorrecta > 0){
        this.router.navigateByUrl('login');

      } else {
        this.servicioCookie.setCookie('cuestionarioContestado', 'si');
        if(this.estaLogueado){
          switch(this.servicioLogin.getRol()){
          case 'Alumno': {
            this.router.navigateByUrl('asistencia-alumno');
            break;
          }
          case 'Profesor': {
            this.router.navigateByUrl('asistencia-personal');
            break;
          }
          case 'Personal': {
            this.router.navigateByUrl('asistencia-personal');
            break;
          }
          }
        } else {
          this.router.navigateByUrl('asistencia-externo');
        }
      }
    }
  }

  cancelar(){
    this.router.navigateByUrl('login');
  }
}