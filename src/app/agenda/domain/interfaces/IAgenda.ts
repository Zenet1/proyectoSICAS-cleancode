import { AgendaDTO } from '../dtos/AgendaDTO';

export interface IAgenda {
    create(agendaData: AgendaDTO): Promise<boolean | null>
}