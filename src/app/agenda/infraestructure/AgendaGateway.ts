import { AgendaDTO } from '../domain/dtos/AgendaDTO';
import { IAgenda } from '../domain/interfaces/IAgenda';

export class AgendaGateway implements IAgenda {
  public async create(agendaData: AgendaDTO) {
    const apiUrl = 'http://localhost:4444/agenda';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendaData),
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
