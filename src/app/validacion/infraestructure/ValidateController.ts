import { UserQRDataDTO } from '../domain/dto/UserQRDataDTO';
import { ValidateGateway } from './ValidateGateway';

export class ValidateController{
  async check(qrData: UserQRDataDTO):Promise <boolean>{
    const res = await new ValidateGateway().check(qrData);
    return res;
  }
}