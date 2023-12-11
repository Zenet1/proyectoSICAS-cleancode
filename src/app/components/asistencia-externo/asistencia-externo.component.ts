import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendaDTO } from 'src/app/agenda/domain/dtos/AgendaDTO';
import { OfficeDTO, OfficeIdDTO } from 'src/app/agenda/domain/dtos/OfficeDTO';
import { AgendaController } from 'src/app/agenda/infraestructure/AgendaController';
import { VisitorController } from 'src/app/registro-externo/intraestructure/controllers/VisitorController';
import { CookieService } from 'src/app/services/cookie/cookie.service';

@Component({
  selector: 'app-asistencia-externo',
  templateUrl: './asistencia-externo.component.html',
  styleUrls: ['./asistencia-externo.component.css'],
  providers: [AgendaController, VisitorController],
})
export class AsistenciaExternoComponent implements OnInit {
  officeList: OfficeDTO[];
  externalAssistanceForm: FormGroup;

  constructor(
    private servicioCookie: CookieService,
    private formBuilder: FormBuilder,
    private router: Router,
    private agendaController: AgendaController,
    private visitorController: VisitorController,
  ) {}

  ngOnInit(): void {
    if (!this.servicioCookie.checkCookie('cuestionarioContestado')) {
      this.router.navigateByUrl('login');
    } else {
      this.externalAssistanceForm = this.formBuilder.group({
        oficinas: this.formBuilder.array([]),
        fechaAsistencia: [''],
      });
      this.getOffices();
    }
  }

  public async getOffices() {
    const offices = await this.agendaController.getOffices();
    this.officeList = offices;
    this.addOfficeFields();
  }

  private get oficinasForm() {
    return this.externalAssistanceForm.get('oficinas') as FormArray;
  }

  private get assistanceDate() {
    return this.externalAssistanceForm.get('fechaAsistencia');
  }

  private addOfficeFields() {
    for (let index = 0; index < this.officeList.length; index++) {
      const preguntaFormGroup = this.formBuilder.group({
        respuesta: [''],
      });
      this.oficinasForm.push(preguntaFormGroup);
    }
  }

  public async createVisit() {
    const selectedOffices = this.formatSelectedOffices();
    if(selectedOffices.length <= 0){
      alert('Selecciona al menos una oficina');
      return;
    }

    if(!this.validDate()){
      alert('No es posible realizar una reservación en el pasado');
      return;
    }

    if (
      window.confirm(
        'Si está seguro que desea asistir, confirme para finalizar'
      )
    ) {
      const agendaDTO: AgendaDTO = {
        IDExterno: this.visitorController.getItem().IDExterno,
        correo: this.visitorController.getItem().correo,
        fecha_agenda: this.formatDate(this.assistanceDate.value),
        oficinas: selectedOffices,
      };
      try {
        await this.agendaController.scheduleVisit(agendaDTO);
        alert('Se ha enviado un código QR a tu correo, que deberás presentar para entrar a la facultad');
        this.router.navigateByUrl('login');
      } catch (error) {
        alert('Ocurrió un error al agendar su visita');
      }
    }
  }

  private formatSelectedOffices(): OfficeIdDTO[] {
    const offices = this.oficinasForm.controls.map((control: FormGroup, index: number) => {
      if(control.get('respuesta').value == true) {
        return {
          IDOficina: this.officeList[index].IDOficina,
        };
      }
    });
    const filteredOffices = offices.filter((office) => office !== undefined);
    return filteredOffices;
  }
  
  private formatDate(date: string) {
    const objectDate = new Date(date);
    const year = objectDate.getFullYear();
    const month = (objectDate.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 al mes ya que en JavaScript los meses van de 0 a 11
    const day = objectDate.getDate().toString().padStart(2, '0');
    const formatDate = year + '-' + month + '-' + day + 'T12:00:00.000Z';
    return formatDate;
  }

  private validDate (): boolean {
    const currentDate = new Date();
    const selectedDate = new Date(this.assistanceDate.value);
    const validDate = selectedDate >= currentDate;
    return validDate;
  }

  public cancel() {
    this.router.navigateByUrl('login');
  }
}
