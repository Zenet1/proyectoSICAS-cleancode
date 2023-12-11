import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css'],
})
export class RegistroUsuariosComponent implements OnInit {
  
  formRegistro:FormGroup;
  roles:any;

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formRegistro = this.formBuilder.group({
      nombre:[''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      usuario:[''],
      contrasena:[''],
      rol:[''],
    });
    this.obtenerRoles();
  }

  trimCampo(campo:any, valor:any){
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formRegistro.controls['nombre'],this.formRegistro.controls['nombre'].value);
    this.trimCampo(this.formRegistro.controls['apellidoPaterno'],this.formRegistro.controls['apellidoPaterno'].value);
    this.trimCampo(this.formRegistro.controls['apellidoMaterno'],this.formRegistro.controls['apellidoMaterno'].value);
    this.trimCampo(this.formRegistro.controls['usuario'],this.formRegistro.controls['usuario'].value);
  }

  obtenerRoles(){
    this.servicioAdmin.obtenerRoles().subscribe(
      (respuesta)=>{
        this.roles = respuesta;
      }
    );
  }

  registrarUsuario(){
    this.trimForm();
    this.servicioAdmin.registrarUsuario(this.formRegistro.value).subscribe(
      (respuesta)=>{
        alert('Se registró el usuario correctamente');
        this.formRegistro.reset();
      },
      (error)=>{
        alert('Ocurrió un error al intentar registrar el usuario');
      }
    );
  }
}