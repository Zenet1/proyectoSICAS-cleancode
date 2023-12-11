import { UserQRDataDTO } from '../domain/dto/UserQRDataDTO';

export class ValidateGateway {
  async check(qrData: UserQRDataDTO): Promise <boolean>{
    try {
      const apiUrl = 'http://localhost:4444/validate'; 
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qrData), 
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