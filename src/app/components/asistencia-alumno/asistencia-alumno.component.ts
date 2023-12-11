import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationDTO } from 'src/app/reservacion/domain/dtos/ReservationDTO';
import { SubjectDTO } from 'src/app/reservacion/domain/dtos/SubjectDTO';
import { ConvertSubjectToMateria } from 'src/app/reservacion/domain/mappers/ConvertSubjectToMateria';
import { ReservationController } from 'src/app/reservacion/infraestructure/ReservationController';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { SessionController } from 'src/app/sesion/infraestructure/SessionController';

@Component({
  selector: 'app-asistencia-alumno',
  templateUrl: './asistencia-alumno.component.html',
  styleUrls: ['./asistencia-alumno.component.css'],
  providers: [ReservationController, SessionController],
})
export class AsistenciaAlumnoComponent implements OnInit {
  subjects: SubjectDTO[];

  constructor(
    private servicioCookie: CookieService,
    private router: Router,
    private reservationController: ReservationController,
    private sessionController: SessionController,
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.servicioCookie.checkCookie('cuestionarioContestado')) {
      this.router.navigateByUrl('inicio-alumno');
    } else {
      try {
        const response = await this.reservationController.getSubjects(this.sessionController.getItem().IDPersonal);
        this.subjects = response;
      } catch (error) {
        if (error instanceof Error) {
          if(error.message === 'User Has Reservation') {
            alert('Ya tiene una reservación para mañana');
          } else if(error.message === 'No Subjects Available') {
            alert('No existe cupo para mañana');
          }
          this.router.navigateByUrl('inicio-alumno');
        } else {
          alert('Error con el servidor');
        }
      }
    }
  }

  public async sendAssistance() {
    if (
      window.confirm(
        'Si está seguro que desea asistir, confirme para finalizar'
      )
    ) {
      const request: ReservationDTO = {
        IDAlumno: this.sessionController.getItem().IDPersonal,
        materias: ConvertSubjectToMateria(this.subjects),
      };
      try {
        await this.reservationController.createReservation(request);
        alert(
          'Se ha registrado tu reserva sastisfactoriamente y se ha enviado un código QR a tu correo, que deberás presentar para acceder a la facultad'
        );
        this.router.navigateByUrl('inicio-alumno');
      } catch (error) {
        alert(
          'Ha ocurrido un error al registrar tu reserva, intenténtalo de nuevo'
        );
      }
    }
  }

  public cancelar() {
    this.router.navigateByUrl('inicio-alumno');
  }
}
