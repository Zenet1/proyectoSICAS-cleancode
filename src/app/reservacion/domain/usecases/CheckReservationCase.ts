import { IReservation } from '../interfaces/IReservation';

export class CheckReservationCase {
  constructor(private readonly reservationGateway: IReservation) {}

  public async validatePreviousReservation(studentID: number) {
    const hasReservation = await this.reservationGateway.checkReservation(
      studentID
    );
    return hasReservation;
  }
}
