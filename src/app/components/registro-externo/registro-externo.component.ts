import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitorController } from 'src/app/registro-externo/intraestructure/controllers/VisitorController';
import { CookieService } from 'src/app/services/cookie/cookie.service';

@Component({
  selector: 'app-registro-externo',
  templateUrl: './registro-externo.component.html',
  styleUrls: ['./registro-externo.component.css'],
  providers: [VisitorController],
})
export class RegistroExternoComponent implements OnInit {
  formExterno: FormGroup;

  constructor(
    private servicioCookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    private visitorController: VisitorController,
  ) {}

  ngOnInit(): void {
    this.formExterno = this.formBuilder.group({
      nombres: [''],
      apellidos: [''],
      empresa: [''],
      correo: [''],
    });
  }

  private trimCampo(campo: any, valor: any) {
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  private trimForm() {
    this.trimCampo(
      this.formExterno.controls['nombres'],
      this.formExterno.controls['nombres'].value
    );
    this.trimCampo(
      this.formExterno.controls['apellidos'],
      this.formExterno.controls['apellidos'].value
    );
    this.trimCampo(
      this.formExterno.controls['empresa'],
      this.formExterno.controls['empresa'].value
    );
    this.trimCampo(
      this.formExterno.controls['correo'],
      this.formExterno.controls['correo'].value
    );
  }

  public async signup() {
    if (
      window.confirm(
        'Si está seguro de sus respuestas, confirme para continuar'
      )
    ) {
      this.trimForm();
      console.log(this.formExterno.value);
      try {
        await this.visitorController.auth(this.formExterno.value);
        this.servicioCookie.setCookie('registroExterno', 'si');
        this.router.navigateByUrl('cuestionario');
      } catch (error) {
        alert('Error durante la autenticación');
      }
    }
  }

  public cancel() {
    this.router.navigateByUrl('login');
  }
}
