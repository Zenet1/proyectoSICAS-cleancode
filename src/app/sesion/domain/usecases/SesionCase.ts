import { AccountDataDTO } from '../dto/AccountDataDTO';
import { CredentialsDTO } from '../dto/CredentialDTO';
import { ILogin } from '../interfaces/ILogin';
import { IIncident } from '../interfaces/IIncident';
import { Roles } from 'src/app/utils/Roles';

export class LoginCase {
  constructor(private readonly loginGateway: ILogin, private readonly indicentGateway: IIncident) {}

  async StartSesion(credentials: CredentialsDTO): Promise<AccountDataDTO> {
    const user = await this.loginGateway.AuthByCredentials(credentials);
    if (user === null) throw new Error('User Not Found');

    if(user.Rol === Roles.ALUMNO) {
      const hasIncident = await this.indicentGateway.find(user.IDPersonal);
      if(hasIncident) throw new Error('User Is Ban');
    }


    return user;
  }
}
