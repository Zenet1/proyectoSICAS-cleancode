import { SendAlertDTO, student } from '../dto/AlertDTO';

export interface IAlert {
    create(alertDTO: SendAlertDTO): Promise<boolean>
}