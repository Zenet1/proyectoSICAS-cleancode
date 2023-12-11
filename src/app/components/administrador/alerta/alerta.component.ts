import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificacionController } from 'src/app/Notificacion/infraestructure/NotificacionController';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css'],
  providers: [NotificacionController],
})
export class AlertaComponent implements OnInit {

  formularioAlerta:FormGroup;
  numAfectados:any;
  gruposAfectados:any;
  siAlertaEnviada:boolean = false;

  constructor( private formBuilder:FormBuilder,
    private notificacionController: NotificacionController) { }

  ngOnInit(): void {
    this.formularioAlerta = this.formBuilder.group({
      matricula: [''],
      fechaInicio:[''],
      fechaFin:[''],
      fechaSuspension:[''],
      fechaSospechosos:[''],
    }
    );
  }

  trimCampo(campo:any, valor:any){
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formularioAlerta.controls['matricula'],this.formularioAlerta.controls['matricula'].value);
  }

  alertar(){
    this.trimForm();
    const plate =  this.formularioAlerta.controls['matricula'].value;
    const start_ban = this.formularioAlerta.controls['fechaInicio'].value;
    const end_ban = this.formularioAlerta.controls['fechaSuspension'].value;
    const email = `a${plate}@alumnos.uady.mx`;
    const Alert ={
      plate: plate,
      email: email,
      start_ban: start_ban,
      end_ban: end_ban,
    };
    this.siAlertaEnviada = false;
    const validacionPeriodo:boolean = this.formularioAlerta.controls['fechaFin'].value >= this.formularioAlerta.controls['fechaInicio'].value;
    const validacionSuspension:boolean = (this.formularioAlerta.controls['fechaSuspension'].value > this.formularioAlerta.controls['fechaFin'].value) ;
    console.log(validacionPeriodo,validacionSuspension);

    if(validacionPeriodo && validacionSuspension){
      if (window.confirm('Confirme para enviar la alerta')){

        this.notificacionController.createAlert(Alert).then(
          (respuesta) => {
            console.log('alerta enviada');
          },
          (error) => {
            console.error('Error:', error);
          }
        );

      }
    } else {
      if(!validacionPeriodo){
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
      } else {
        alert('La fecha de fin no puede ser mayor que la fecha de suspension');
      }
    }
  }
  
}