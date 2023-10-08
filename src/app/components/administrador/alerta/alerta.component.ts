import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {

  formularioAlerta:FormGroup;
  numAfectados:any;
  gruposAfectados:any;
  siAlertaEnviada:boolean = false;

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formularioAlerta = this.formBuilder.group({
        matricula: [""],
        fechaInicio:[""],
        fechaFin:[""],
        fechaSuspension:[""],
        fechaSospechosos:[""]
      }
    );
  }

  trimCampo(campo:any, valor:any){
    var textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formularioAlerta.controls["matricula"],this.formularioAlerta.controls["matricula"].value);
  }

  alertar(){
    this.trimForm();
    this.siAlertaEnviada = false;
    let validacionPeriodo:boolean = this.formularioAlerta.controls['fechaFin'].value >= this.formularioAlerta.controls['fechaInicio'].value;
    let validacionSuspension:boolean = (this.formularioAlerta.controls['fechaSuspension'].value > this.formularioAlerta.controls['fechaFin'].value) && (this.formularioAlerta.controls['fechaSospechosos'].value > this.formularioAlerta.controls['fechaFin'].value);
    if(validacionPeriodo && validacionSuspension){
      if (window.confirm("Confirme para enviar la alerta")){
        this.servicioAdmin.obtenerAfectados(this.formularioAlerta.value).subscribe(
          respuesta=>{
            this.siAlertaEnviada = true;
            this.gruposAfectados = respuesta.grupos;
            this.numAfectados = respuesta.usuarios; 
            this.servicioAdmin.alertar(this.gruposAfectados, this.numAfectados).subscribe(
              respuesta=>{
                alert("Se ha alertado a los alumnos correctamente");
              },
              error=>{
                alert("Ocurrió un error al enviar la alerta");
              }
            );
          }
        );
      }
    } else {
      if(!validacionPeriodo){
        alert("La fecha de inicio no puede ser mayor que la fecha de fin");
      } else {
        alert("La fecha de fin no puede ser mayor que la fecha de suspension");
      }
    }
  }
}