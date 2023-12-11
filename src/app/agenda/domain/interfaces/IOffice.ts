import { OfficeDTO } from '../dtos/OfficeDTO';

export interface IOffice {
    getAll(): Promise<OfficeDTO[]>
}