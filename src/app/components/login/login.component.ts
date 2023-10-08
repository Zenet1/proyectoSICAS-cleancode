import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  estaLogueado: Boolean;
  formLogin:FormGroup;
  facultades:any;

  constructor(private servicioLogin:LoginService, private servicioCookie:CookieService, private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    this.servicioCookie.deleteCookie("cuestionarioContestado");
    if(this.estaLogueado){
      switch(this.servicioLogin.getRol()) { 
        case "Alumno": { 
          this.router.navigateByUrl('inicio-alumno');
          break; 
        } 
        case "Administrador": { 
          this.router.navigateByUrl('inicio-administrador');
          break; 
        }
        case "Capturador":{
          this.router.navigateByUrl('inicio-capturador');
          break;
        }
        case "Profesor":{
          this.router.navigateByUrl('inicio-personal');
          break;
        }
        case "Personal":{
          this.router.navigateByUrl('inicio-personal');
          break;
        }
        default:{
          this.router.navigateByUrl('login');
        }
      } 
    } else {
      this.formLogin = this.formBuilder.group({
        usuario: [""],
        contrasena: [""],
        facultad:[""]
      });
    this.obtenerFacultades();
    }
  }

  trimCampo(campo:any, valor:any){
    var textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formLogin.controls["usuario"],this.formLogin.controls["usuario"].value);
  }

  obtenerFacultades(){
    this.servicioLogin.obtenerFacultades().subscribe(
      respuesta=>{
        this.facultades = respuesta;
      }
    );
  }

  iniciarSesion(){
    this.trimForm();
    this.servicioLogin.iniciarSesion(this.formLogin.value, "validarINET");
  }
}