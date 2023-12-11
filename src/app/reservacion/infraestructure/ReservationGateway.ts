import { ReservationDTO } from '../domain/dtos/ReservationDTO';

export class ReservationGateway {
  createReservation(reservationData: ReservationDTO): Promise<boolean | null> {
    const apiUrl = 'http://localhost:4444/student/reserve';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    };
    return fetch(apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La solicitud falló con código de estado: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        return data.data;
      })
      .catch(() => {
        return null;
      });
  }

  checkReservation(studentID: number):Promise<boolean | null> {
    const apiUrl = `http://localhost:4444/student/reserve/check/${studentID}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch(apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La solicitud falló con código de estado: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        return data.data;
      })
      .catch(() => {
        return null;
      });
  }
}
