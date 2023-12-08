import { AccountDataDTO } from '../domain/dto/AccountDataDTO';
import { CredentialsDTO } from '../domain/dto/CredentialDTO';
import { LoginCase } from '../domain/usecase/SesionCase';
import { LoginGateway } from './LoginGateway';

export class LoginController {
  async find(credentials: CredentialsDTO, ): Promise<AccountDataDTO> {
    const res = await new LoginCase(new LoginGateway())
      .StartSesion(credentials);
    console.log(res);
    return res;
  }

}