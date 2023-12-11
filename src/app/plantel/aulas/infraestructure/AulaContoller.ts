import { CreateClassroomDTO, GetClassroomResponse, UpdateClassroomDTO } from '../domain/dto/ClassroomDTO';
import { CRUDClassroomCase } from '../domain/usecases/CRUDClassroomCase';
import { AulaGateway } from './AulaGateway';


export class AulasController {
  async createAula(createAula:CreateClassroomDTO): Promise<GetClassroomResponse>{
    const res = await new CRUDClassroomCase( new AulaGateway()).createClassroom(createAula);
    return res;
  }

  async getAula(id: number): Promise<GetClassroomResponse>{
    const res = await new CRUDClassroomCase(new AulaGateway()).getClassroomByID(id);
    return res;
  }

  async getAllAula(): Promise<GetClassroomResponse[]> {
    const res = await new CRUDClassroomCase(new AulaGateway).getAllClassrooms();
    return res;
  }

  async updateAula(id: number, updateDTO: UpdateClassroomDTO): Promise<boolean>{
    const res = await new CRUDClassroomCase(new AulaGateway()).updateClassroom(id,updateDTO);
    return res;
  }

}