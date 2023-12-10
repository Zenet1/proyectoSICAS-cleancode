import { IncidentDTO } from '../domain/dto/IncidentDTO';
import { IIncident } from '../domain/interfaces/IIncident';

export class IncidentGateway implements IIncident {
  find(studentID: number): Promise<IncidentDTO> {
    const apiUrl = `http://localhost:4444/incidents/${studentID}`;
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
