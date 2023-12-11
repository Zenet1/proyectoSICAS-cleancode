import { AgendaDTO } from '../dtos/AgendaDTO';
import { IAgenda } from '../interfaces/IAgenda';

export class ScheduleVisitCase {
  constructor(private readonly agendaGateway: IAgenda) {}

  public async scheduleVisit (agendaData: AgendaDTO) {
    const response = await this.agendaGateway.create(agendaData);
    if(response === null) throw new Error('Error to Create Agenda');
    return response;
  }
}
