import { ReservationDTO } from '../domain/dtos/ReservationDTO';
import { SubjectDTO } from '../domain/dtos/SubjectDTO';
import { CheckReservationCase } from '../domain/usecases/CheckReservationCase';
import { CreateReservationCase } from '../domain/usecases/CreateReservationCase';
import { GetSubjectsCase } from '../domain/usecases/GetSubjectsCase';
import { ReservationGateway } from './ReservationGateway';
import { SubjectGateway } from './SubjectGateway';

export class ReservationController {
  public async getSubjects(studentID: number): Promise<SubjectDTO[]> {
    const response = await new GetSubjectsCase(
      new SubjectGateway(), new ReservationGateway()
    ).getAvailablesSubjects(studentID);
    return response;
  }

  public async createReservation(reservationData: ReservationDTO) {
    const response = await new CreateReservationCase(
      new ReservationGateway()
    ).createReservation(reservationData);
    return response;
  }
}
