import { OfficeDTO } from '../domain/dtos/OfficeDTO';
import { IOffice } from '../domain/interfaces/IOffice';

export class OfficeGateway implements IOffice {
  getAll(): Promise<OfficeDTO[]> {
    const apiUrl = 'http://localhost:4444/offices';
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
