import { ReservationDTO } from '../dtos/ReservationDTO';
import { IReservation } from '../interfaces/IReservation';

export class CreateReservationCase {
  constructor(private readonly reservationGateway: IReservation) {}

  public async createReservation(reservationData: ReservationDTO) {
    const response = await this.reservationGateway.createReservation(
      reservationData
    );
    if (response === null) throw new Error('Error to Create Reservation');
    return response;
  }
}
