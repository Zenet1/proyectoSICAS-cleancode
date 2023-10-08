import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { CuestionarioService } from 'src/app/services/cuestionario/cuestionario.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {
  cuestionario:FormGroup;
  estaLogueado:boolean;
  pregPrimarias:any;
  pregSecundarias:any;
  banderas:boolean[] = [];
  
  constructor(private cd:ChangeDetectorRef,private servicioCuestionario:CuestionarioService, private servicioLogin:LoginService, private servicioCookie:CookieService, private formBuilder: FormBuilder, private router:Router) {
    this.cuestionario = this.formBuilder.group({
      preguntas: this.formBuilder.array([]),
      preguntasSecundarias: this.formBuilder.array([]), 
    });
  }

  ngOnInit(): void {
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    if(this.estaLogueado){
      switch(this.servicioLogin.getRol()) {
        case "Administrador": { 
          this.router.navigateByUrl('inicio-administrador');
          break;
        }
        case "Capturador":{
          this.router.navigateByUrl('inicio-capturador');
          break;
        }
        case "Alumno":{
          this.obtenerPreguntas();
          break;
        }
        case "Profesor":{
          this.obtenerPreguntas();
          break;
        }
        case "Personal":{
          this.obtenerPreguntas();
          break;
        }
      }
    } else {
      if(!this.servicioCookie.checkCookie("registroExterno")){
        this.router.navigateByUrl('login');
      } else {
        this.obtenerPreguntas();
      }
    }
  }

  obtenerPreguntas(){
    this.servicioCuestionario.obtenerPreguntas().subscribe(
      (respuesta:any)=>{
        this.pregPrimarias = respuesta.primarias;
        this.pregSecundarias = respuesta.secundarias;
        this.agregarCamposPreguntas(this.pregPrimarias.length, this.preguntasForm);
        this.agregarCamposPreguntas(this.pregSecundarias.length, this.pregSecundariasForm);
        for(let index = 0; index<this.pregPrimarias.length; index++){
          this.banderas.push(false);
        }
      }
    );
  }

  agregarCamposPreguntas(cantidad:any, campo:any){
    for (let index = 0; index < cantidad; index++) {
      const preguntaFormGroup = this.formBuilder.group({
        respuesta:['']
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
    if (window.confirm("Si está seguro de sus respuestas, confirme para continuar")) {
      var cantidadIncorrecta:number = 0;
      var tieneSecundarias:boolean = false;
      for (let index = 0; index < this.preguntasForm.length; index++) {
        if(this.preguntasForm.controls[index].get("respuesta").value != this.pregPrimarias[index].Respuesta){
          for (let j = 0; j < this.pregSecundariasForm.length; j++) {
            if(this.pregSecundarias[j].Enlace  == this.pregPrimarias[index].IDPregunta){
              tieneSecundarias = true;
              if(this.pregSecundariasForm.controls[j].get("respuesta").value  != ''){
                if(this.pregSecundariasForm.controls[j].get("respuesta").value != this.pregSecundarias[j].Respuesta){
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
        this.servicioCuestionario.rechazado().subscribe(
          respuesta=>{
            alert("De acuerdo a tus respuestas, no es posible que asistas a la facultad, se te ha notificado por correo electrónico");
            this.router.navigateByUrl('login');
          }
        );
      } else {
        this.servicioCookie.setCookie("cuestionarioContestado", "si");
        if(this.estaLogueado){
          switch(this.servicioLogin.getRol()){
            case "Alumno": {
              this.router.navigateByUrl('asistencia-alumno');
              break;
            }
            case "Profesor": {
              this.router.navigateByUrl('asistencia-personal');
              break;
            }
            case "Personal": {
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