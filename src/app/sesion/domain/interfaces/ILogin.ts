import { AccountDataDTO } from '../dto/AccountDataDTO';
import { CredentialsDTO } from '../dto/CredentialDTO';

export interface ILogin {
    AuthByCredentials(credentials: CredentialsDTO): Promise<AccountDataDTO | null>
}