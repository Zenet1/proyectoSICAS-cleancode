import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-inicio-capturador',
  templateUrl: './inicio-capturador.component.html',
  styleUrls: ['./inicio-capturador.component.css']
})
export class InicioCapturadorComponent implements OnInit {
  estaLogueado:boolean;
  usuario:string;
  constructor(private servicioLogin:LoginService) { }

  ngOnInit(): void {
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    if(this.estaLogueado){
      this.usuario = this.servicioLogin.getUsuario();
    }
  }
}