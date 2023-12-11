import { ReservationGateway } from '../../infraestructure/ReservationGateway';
import { ISubject } from '../interfaces/ISubject';
import { CheckReservationCase } from './CheckReservationCase';

export class GetSubjectsCase {
  constructor(private readonly subjectGateway: ISubject, private readonly reservationGateway: ReservationGateway) {}

  public async getAvailablesSubjects(studentID: number) {
    const hasReservation = await new CheckReservationCase(this.reservationGateway).validatePreviousReservation(studentID);
    if(!hasReservation) throw new Error('User Has Reservation');
    const subjects = await this.subjectGateway.getByStudentId(studentID);
    if (subjects === null) throw new Error('No Subjects Available');
    return subjects;
  }
}
