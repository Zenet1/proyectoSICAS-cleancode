//import { error } from 'console';
//import { NodeMailer } from '../../../utils/correo/NodeMailer';
import { IAlert } from '../interfaces/IAlert';
import { SendAlertDTO } from '../dto/AlertDTO';


export class SetBanCase {
  constructor(private readonly alertRepository: IAlert) { }

  async setBan(alertData: SendAlertDTO) {
    try {
      const result = await this.alertRepository.create(alertData);
      return result; 
    } catch (error) {
      console.error('Error al establecer la prohibición:', error);
      throw error;
    }
  }
}