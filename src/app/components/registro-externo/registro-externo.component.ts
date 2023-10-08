import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { ExternoService } from 'src/app/services/externo/externo.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-registro-externo',
  templateUrl: './registro-externo.component.html',
  styleUrls: ['./registro-externo.component.css']
})
export class RegistroExternoComponent implements OnInit {

  formExterno:FormGroup;
  facultades:any;

  constructor(private servicioExterno:ExternoService, private servicioLogin:LoginService, private servicioCookie:CookieService, private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.formExterno = this.formBuilder.group({
        nombre: [""],
        apellidos: [""],
        empresa: [""],
        correo: [""],
        facultad: [""]
      }
    );
    this.obtenerFacultades();
  }

  trimCampo(campo:any, valor:any){
    var textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formExterno.controls["nombre"],this.formExterno.controls["nombre"].value);
    this.trimCampo(this.formExterno.controls["apellidos"],this.formExterno.controls["apellidos"].value);
    this.trimCampo(this.formExterno.controls["empresa"],this.formExterno.controls["empresa"].value);
    this.trimCampo(this.formExterno.controls["correo"],this.formExterno.controls["correo"].value);
  }

  obtenerFacultades(){
    this.servicioLogin.obtenerFacultades().subscribe(
      respuesta=>{
        this.facultades = respuesta;
      }
    );
  }

  registrarse(){
    if (window.confirm("Si está seguro de sus respuestas, confirme para continuar")) {
      this.trimForm();
      this.servicioExterno.guardarExterno(this.formExterno.value).subscribe(
        respuesta=>{
          this.servicioCookie.setCookie("registroExterno","si");
          this.router.navigateByUrl('cuestionario');
        }
      );
    }
  }

  cancelar(){
    this.router.navigateByUrl('login');
  }
}