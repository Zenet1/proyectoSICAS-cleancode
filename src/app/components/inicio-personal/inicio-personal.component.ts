import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-inicio-personal',
  templateUrl: './inicio-personal.component.html',
  styleUrls: ['./inicio-personal.component.css']
})
export class InicioPersonalComponent implements OnInit {
  estaLogueado:boolean;
  usuario:string;

  constructor(private servicioLogin:LoginService, private servicioCookie:CookieService, private router: Router) { }

  ngOnInit(): void {
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    this.servicioCookie.deleteCookie("cuestionarioContestado");
    if(this.estaLogueado){
      this.usuario = this.servicioLogin.getUsuario();
    }
  }

  cuestionario(){
    this.router.navigateByUrl('cuestionario');
  }
}