import { OfficeIdDTO } from './OfficeDTO';

export interface AgendaDTO {
    IDExterno: number
    correo: string
    fecha_agenda: string
    oficinas: OfficeIdDTO[]
}