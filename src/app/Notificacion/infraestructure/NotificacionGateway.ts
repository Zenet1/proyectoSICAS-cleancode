import { SendAlertDTO } from '../domain/dto/AlertDTO';
import { IAlert } from '../domain/interfaces/IAlert';

export class NotificacionGateway implements IAlert {
  async create(alertEmailData: SendAlertDTO): Promise<boolean> {
    try {
      const apiUrl = 'http://localhost:4444/alerts'; 
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertEmailData), 
      };

      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error(`La solicitud falló con código de estado: ${response.status}`);
      }
      
      return true; 
    } catch (error) {
      console.error(error);
      return false; 
    }
  }
}
