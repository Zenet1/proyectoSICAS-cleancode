import { AccountDataDTO } from "../dto/AccountDataDTO";
import { CredentialsDTO } from "../dto/CredentialDTO";
import { ILogin } from "../interfaces/ILogin";

export class LoginCase {
    constructor(private readonly loginStore: ILogin) { }

    async StartSesion(credentials: CredentialsDTO): Promise<AccountDataDTO> {
        const user = await this.loginStore.AuthByCredentials(credentials)

        if (user === null) throw new Error(`User Not Found`)

        return user;
    }

}

