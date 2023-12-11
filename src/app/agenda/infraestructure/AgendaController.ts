import { AgendaDTO } from '../domain/dtos/AgendaDTO';
import { OfficeDTO } from '../domain/dtos/OfficeDTO';
import { ScheduleVisitCase } from '../domain/usecases/ScheduleVisitCase';
import { AgendaGateway } from './AgendaGateway';
import { OfficeGateway } from './OfficeGateway';

export class AgendaController {
  public async getOffices(): Promise<OfficeDTO[]> {
    const offices = await new OfficeGateway().getAll();
    return offices;
  }

  public async scheduleVisit(agendaData: AgendaDTO): Promise<any> {
    const response = await new ScheduleVisitCase(new AgendaGateway()).scheduleVisit(agendaData);
    return response;
  }
}
