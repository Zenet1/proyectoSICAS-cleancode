import { CreateOfficeDTO, GetOfficeResponse, UpdateOfficeDTO } from '../domain/dto/OfficeDTO';
import { CRUDOfficeCase } from '../domain/usecases/CRUDOfficeCase';
import { OficinasGateway } from './OficinasGateway';

export class OficinasController{
  async createOficina(office: CreateOfficeDTO): Promise<GetOfficeResponse | null>{
    const res = await new CRUDOfficeCase(new OficinasGateway()).createOffice(office);
    return res;
  }

  async getOficina(id:number): Promise <GetOfficeResponse>{
    const res = await new CRUDOfficeCase(new OficinasGateway).getOfficeByID(id);
    return res;
  }

  async getAllOffice(): Promise <GetOfficeResponse[]>{
    const res = await new CRUDOfficeCase(new OficinasGateway).getAllOffices();
    return res;
  }

  async updateOffice(id: number, updateDTO: UpdateOfficeDTO): Promise <boolean>{
    const res = await new CRUDOfficeCase(new OficinasGateway()).updateOffice(id,updateDTO);
    return res;
  }

  async deleteOffice(id: number): Promise<boolean>{
    const res = await new CRUDOfficeCase(new OficinasGateway()).deleteOffice(id);
    return res;
  }
}