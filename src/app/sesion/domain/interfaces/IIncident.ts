import { IncidentDTO } from '../dto/IncidentDTO';

export interface IIncident {
    find(studentID: number): Promise<IncidentDTO | null>
}