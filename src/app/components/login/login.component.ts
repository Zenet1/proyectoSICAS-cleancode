import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { SessionController } from 'src/app/sesion/infraestructure/controllers/SessionController';
import { AccountDataDTO } from 'src/app/sesion/domain/dto/AccountDataDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SessionController],
})
export class LoginComponent implements OnInit {
  estaLogueado: boolean;
  formLogin: FormGroup;
  facultades: any;

  constructor(
    private servicioCookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sessionController: SessionController 
  ) {}

  ngOnInit(): void {
    this.servicioCookie.deleteCookie('cuestionarioContestado');
    this.estaLogueado = this.sessionController.isLoggedIn();
    const session = this.sessionController.getItem();
    if (this.estaLogueado) {
      this.routerHandle(session.Rol);
    } else {
      this.resetFields();
    }
  }
  
  public async login() {
    this.trimForm();
    try {
      const response: AccountDataDTO = await this.sessionController.login(this.formLogin.value);
      this.routerHandle(response.Rol);
    } catch (error) {
      if (error instanceof Error) {
        if(error.message === 'User Not Found') {
          alert('Usuario o contraseña incorrectos');
        } else if (error.message === 'User Is Ban') {
          alert('Su usuario esta baneado');
        }
      } else {
        alert('Error durante la autenticación');
      }
    }
  }

  private trimCampo(campo: any, valor: any) {
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  private trimForm() {
    this.trimCampo(
      this.formLogin.controls['usuario'],
      this.formLogin.controls['usuario'].value
    );
  }

  private resetFields () {
    this.formLogin = this.formBuilder.group({
      usuario: [''],
      contrasena: [''],
    });
  }

  private routerHandle (rol: string) {
    const routes = {
      Alumno: 'inicio-alumno',
      Capturador: 'inicio-capturador',
      Administrador: 'inicio-administrador',
      Personal: 'inicio-personal',
      Profesor: 'inicio-profesor',
    };
    const defaultRoute = 'login';
    const route = routes[rol] || defaultRoute;
    this.router.navigateByUrl(route);
  }
}