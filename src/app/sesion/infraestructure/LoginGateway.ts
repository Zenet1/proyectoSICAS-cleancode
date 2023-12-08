import { AccountDataDTO } from '../domain/dto/AccountDataDTO';
import { CredentialsDTO } from '../domain/dto/CredentialDTO';
import { ILogin } from '../domain/interfaces/ILogin';

export class LoginGateway implements ILogin {
  AuthByCredentials(credentials: CredentialsDTO): Promise<AccountDataDTO | null> {
    const apiUrl = 'http://localhost:4444/auth';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    return fetch(apiUrl, options).then((response) => {
      if (!response.ok) {
        throw new Error(`La solicitud falló con código de estado: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      console.log('Datos de la API:', data);
      return data.data;
    }).catch((error) => {
      //console.log(error);
      return null;
    });
  }
}