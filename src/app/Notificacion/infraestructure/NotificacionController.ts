import { SendAlertDTO } from '../domain/dto/AlertDTO';
import { SetBanCase } from '../domain/usecases/SetBanCase';
import { NotificacionGateway } from './NotificacionGateway';

export class NotificacionController{
  async createAlert(AlertDTO: SendAlertDTO): Promise<boolean> {
    const res = await new SetBanCase(new NotificacionGateway()).setBan(AlertDTO);
    return res;
  }
}