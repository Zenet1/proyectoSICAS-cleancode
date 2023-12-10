import { AccountDataDTO } from '../domain/dto/AccountDataDTO';
import { CredentialsDTO } from '../domain/dto/CredentialDTO';
import { LoginCase } from '../domain/usecase/SesionCase';
import { IncidentGateway } from './IncidentGateway';
import { LoginGateway } from './LoginGateway';

export class SessionController {
  public async login(credentials: CredentialsDTO): Promise<AccountDataDTO> {
    const response = await new LoginCase(new LoginGateway(), new IncidentGateway())
      .StartSesion(credentials);
    sessionStorage.setItem('usuario', JSON.stringify(response));
    return response;
  }

  public logout () {
    sessionStorage.removeItem('usuario');
  }

  public getItem (): AccountDataDTO {
    return JSON.parse(sessionStorage.getItem('usuario'));
  }

  public isLoggedIn (): boolean {
    return (this.getItem()) ? true : false;
  }
}