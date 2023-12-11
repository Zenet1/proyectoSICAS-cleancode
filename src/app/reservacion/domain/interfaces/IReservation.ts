import { ReservationDTO } from '../dtos/ReservationDTO';

export interface IReservation {
    createReservation(reservationData: ReservationDTO): Promise<boolean | null>;
    checkReservation(studentID: number): Promise<boolean | null>;
}