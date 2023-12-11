import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/app/services/alumno/alumno.service';
import { CookieService } from 'src/app/services/cookie/cookie.service';

@Component({
  selector: 'app-asistencia-alumno',
  templateUrl: './asistencia-alumno.component.html',
  styleUrls: ['./asistencia-alumno.component.css'],
})
export class AsistenciaAlumnoComponent implements OnInit {
  clases:any;
 
  constructor(private servicioAlumno:AlumnoService, private servicioCookie:CookieService, private router:Router) { }

  ngOnInit(): void {
    if(!this.servicioCookie.checkCookie('cuestionarioContestado')){
      this.router.navigateByUrl('inicio-alumno');
    } else {
      this.servicioAlumno.combrobarReservacion().subscribe(
        (respuesta)=>{
          if(respuesta == 'Aceptado'){
            this.obtenerClases();
          } else if (respuesta == 'Rechazado'){
            alert('Ya tiene una reservación para mañana');
            this.router.navigateByUrl('inicio-alumno');
          }
        }
      );
    }
  }

  obtenerClases(){
    this.servicioAlumno.obtenerClases().subscribe(
      (respuesta)=>{
        if(respuesta.length > 0){
          this.clases = respuesta;
        } else {
          alert('No quedan cupos disponibles para mañana');
          this.router.navigateByUrl('inicio-alumno');
        }
      }
    );
  }

  enviarAsistencia(){
    if (window.confirm('Si está seguro que desea asistir, confirme para finalizar')){
      this.servicioAlumno.enviarAsistencia(this.clases).subscribe(
        (respuesta)=>{
          alert('Se ha registrado tu reserva sastisfactoriamente y se ha enviado un código QR a tu correo, que deberás presentar para acceder a la facultad');
          this.router.navigateByUrl('inicio-alumno');
        },
        (error)=>{
          alert('Ha ocurrido un error al registrar tu reserva, intenténtalo de nuevo');
        }
      );
    }
  }

  cancelar(){
    this.router.navigateByUrl('inicio-alumno');
  }
}