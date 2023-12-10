import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LoginService } from 'src/app/services/login/login.service';
import { LoginController } from 'src/app/sesion/infraestructure/SessionController';
import { AccountDataDTO } from 'src/app/sesion/domain/dto/AccountDataDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginController],
})
export class LoginComponent implements OnInit {
  estaLogueado: boolean;
  formLogin: FormGroup;
  facultades: any;

  constructor(
    private servicioLogin: LoginService,
    private servicioCookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loginController: LoginController
  ) {}

  ngOnInit(): void {
    this.estaLogueado = this.servicioLogin.isLoggedIn();
    this.servicioCookie.deleteCookie('cuestionarioContestado');
    if (this.estaLogueado) {
      switch (this.servicioLogin.getRol()) {
      case 'Alumno': {
        this.router.navigateByUrl('inicio-alumno');
        break;
      }
      case 'Administrador': {
        this.router.navigateByUrl('inicio-administrador');
        break;
      }
      case 'Capturador': {
        this.router.navigateByUrl('inicio-capturador');
        break;
      }
      case 'Profesor': {
        this.router.navigateByUrl('inicio-personal');
        break;
      }
      case 'Personal': {
        this.router.navigateByUrl('inicio-personal');
        break;
      }
      default: {
        this.router.navigateByUrl('login');
      }
      }
    } else {
      this.formLogin = this.formBuilder.group({
        usuario: [''],
        contrasena: [''],
      });
    }
  }

  trimCampo(campo: any, valor: any) {
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm() {
    this.trimCampo(
      this.formLogin.controls['usuario'],
      this.formLogin.controls['usuario'].value
    );
  }

  async iniciarSesion() {
    this.trimForm();
    try {
      const response: AccountDataDTO = await this.loginController.find(this.formLogin.value);
      sessionStorage.setItem('usuario', JSON.stringify(response));
      this.routerHandle(response.Rol);
    } catch (error) {
      if (error instanceof Error) {
        if(error.message === 'User Not Found') {
          alert('Usuario o contraseña incorrectos');
        } else if (error.message === 'User Is Ban') {
          alert('El usuario esta baneado');
        }
      } else {
        // Otro tipo de error, puedes manejarlo de acuerdo a tus necesidades
        alert('Error durante la autenticación');
      }
    }
  }

  routerHandle (rol: string) {
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