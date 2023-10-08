import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LoginService } from 'src/app/services/login/login.service';
import { PersonalService } from 'src/app/services/personal/personal.service';

@Component({
  selector: 'app-asistencia-personal',
  templateUrl: './asistencia-personal.component.html',
  styleUrls: ['./asistencia-personal.component.css']
})
export class AsistenciaPersonalComponent implements OnInit {

  constructor(private servicioPersonal:PersonalService, private servicioLogin:LoginService, private servicioCookie:CookieService, private router:Router) { }

  ngOnInit(): void {
    if(!this.servicioCookie.checkCookie("cuestionarioContestado")){
      this.router.navigateByUrl('inicio-personal');
    } else {
      this.servicioPersonal.combrobarReservacion(this.servicioLogin.getRol()).subscribe(
        respuesta=>{
          if(respuesta == "Rechazado"){
            alert("Ya tiene una reservación para mañana");
            this.router.navigateByUrl("inicio-personal");
          } 
        }
      );
    }
  }

  enviarAsistencia(){
    if (window.confirm("Si está seguro que desea asistir, confirme para finalizar")){
      this.servicioPersonal.enviarAsistencia(this.servicioLogin.getUsuario(),this.servicioLogin.getRol()).subscribe(
        respuesta=>{
          alert('Se ha registrado tu reserva sastisfactoriamente y se ha enviado un código QR a tu correo, que deberás presentar para acceder a la facultad');
          this.router.navigateByUrl('inicio-personal');
        },
        error=>{
          alert('Ha ocurrido un error al registrar tu reserva, intenténtalo de nuevo');
        }
      );
    }
  }

  cancelar(){
    this.router.navigateByUrl('inicio-personal');
  }
}