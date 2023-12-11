import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AnswerDTO } from 'src/app/chequeo/domain/dtos/AnswerDTO';
import { FilteredAnswersDTO } from 'src/app/chequeo/domain/dtos/FilteredAnswersDTO';
import { FilteredQuestionsDTO } from 'src/app/chequeo/domain/dtos/FilteredQuestionsDTO';
import { convertToFilteredAnswers } from 'src/app/chequeo/domain/mappers/ConvertToFilteredAnswers';
import { HealtCheckController } from 'src/app/chequeo/infraestructure/controllers/HealtCheckController';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { AccountDataDTO } from 'src/app/sesion/domain/dto/AccountDataDTO';
import { SessionController } from 'src/app/sesion/infraestructure/SessionController';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
  providers: [HealtCheckController, SessionController],
})
export class CuestionarioComponent implements OnInit {
  cuestionario: FormGroup;
  estaLogueado: boolean;
  mainQuestions: any;
  secondaryQuestions: any;
  flags: boolean[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private servicioCookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    private healtCheckController: HealtCheckController,
    private sessionController: SessionController
  ) {
    this.cuestionario = this.formBuilder.group({
      preguntas: this.formBuilder.array([]),
      preguntasSecundarias: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.estaLogueado = this.sessionController.isLoggedIn();
    const session = this.sessionController.getItem();
    if (this.estaLogueado) {
      switch (session.Rol) {
      case 'Administrador': {
        this.router.navigateByUrl('inicio-administrador');
        break;
      }
      case 'Capturador': {
        this.router.navigateByUrl('inicio-capturador');
        break;
      }
      case 'Alumno': {
        this.getQuestions();
        break;
      }
      case 'Profesor': {
        this.getQuestions();
        break;
      }
      case 'Personal': {
        this.getQuestions();
        break;
      }
      }
    } else {
      if (!this.servicioCookie.checkCookie('registroExterno')) {
        this.router.navigateByUrl('login');
      } else {
        this.getQuestions();
      }
    }
  }

  public async getQuestions() {
    const questions: FilteredQuestionsDTO =
      await this.healtCheckController.getAll();
    this.mainQuestions = questions.primarias;
    this.secondaryQuestions = questions.secundarias;
    this.addQuestionsFields(this.mainQuestions.length, this.formQuestions);
    this.addQuestionsFields(
      this.secondaryQuestions.length,
      this.secondaryFormQuestions
    );
    for (let index = 0; index < this.mainQuestions.length; index++) {
      this.flags.push(false);
    }
  }

  election(event, i) {
    if (this.mainQuestions[i].Respuesta != event) {
      this.flags[i] = true;
    } else {
      this.flags[i] = false;
    }
    this.cd.detectChanges();
  }

  public async validQuestions() {
    if (
      window.confirm(
        'Si está seguro de sus respuestas, confirme para continuar'
      )
    ) {
      const formatQuestions: FilteredAnswersDTO = convertToFilteredAnswers(
        this.formatMainQuestions(this.formQuestions),
        this.formatSecondaryQuestions(this.secondaryFormQuestions)
      );
      try {
        const canAccess: boolean =
          await this.healtCheckController.checkQuestions(formatQuestions);
        if (canAccess) {
          this.servicioCookie.setCookie('cuestionarioContestado', 'si');
          this.estaLogueado = this.sessionController.isLoggedIn();
          const session: AccountDataDTO = this.sessionController.getItem();
          if (this.estaLogueado) {
            this.routerHandle(session.Rol);
          } else {
            this.router.navigateByUrl('asistencia-externo');
          }
        } else {
          alert(
            'De acuerdo a tus respuestas, no es posible que asistas a la facultad.'
          );
          this.router.navigateByUrl('login');
        }
      } catch (error) {
        alert('Error durante la verficación de las preguntas');
      }
    }
  }

  public cancel() {
    this.router.navigateByUrl('login');
  }

  private addQuestionsFields(cantidad: any, campo: any) {
    for (let index = 0; index < cantidad; index++) {
      const preguntaFormGroup = this.formBuilder.group({
        respuesta: [''],
      });
      campo.push(preguntaFormGroup);
    }
  }

  private formatMainQuestions(formArray: FormArray): AnswerDTO[] {
    return formArray.controls.map((control: FormGroup, index: number) => ({
      question: this.mainQuestions[index].Pregunta,
      answer: control.get('respuesta').value,
    }));
  }

  private formatSecondaryQuestions(formArray: FormArray): AnswerDTO[] {
    return formArray.controls.map((control: FormGroup, index: number) => ({
      question: this.secondaryQuestions[index].Pregunta,
      answer: control.get('respuesta').value,
    }));
  }

  private routerHandle(rol: string) {
    const routes = {
      Alumno: 'asistencia-alumno',
      Personal: 'asistencia-personal',
      Profesor: 'asistencia-personal',
    };
    const route = routes[rol];
    this.router.navigateByUrl(route);
  }

  private get formQuestions(): FormArray {
    return this.cuestionario.get('preguntas') as FormArray;
  }

  private get secondaryFormQuestions(): FormArray {
    return this.cuestionario.get('preguntasSecundarias') as FormArray;
  }
}
