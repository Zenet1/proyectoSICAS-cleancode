import { GetBuildResponse } from '../domain/dto/BuildDTO';
import { GetBuildsCase } from '../domain/usecases/GetBuildsCase';
import { EdificiosGateway } from './EdificiosGateway';

export class EdificiosController{
  async getEdificios(): Promise<GetBuildResponse[]>{
    const res = await new GetBuildsCase(new EdificiosGateway).getAllBuilds();
    return res;

  }
}