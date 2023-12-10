import { CreateClassroomDTO } from '../dto/ClassroomDTO';
import { UpdateClassroomDTO } from '../dto/ClassroomDTO';
import { IClassroom } from '../interfaces/IClassroom';

export class CRUDClassroomCase {
  constructor(private readonly classroomRepository: IClassroom) { }

  async getAllClassrooms() {
    const result = await this.classroomRepository.getAll();
    return result;
  }

  async getClassroomByID(id: number) {
    const result = await this.classroomRepository.get(id);

    if (result === null) throw new Error('Cannot find classroom');

    return result;
  }
    
  async createClassroom(createDTO: CreateClassroomDTO) {
    const result = await this.classroomRepository.create(createDTO);

    if (result === null) throw new Error('Cannot create the classroom');

    return result;
  }

  async updateClassroom(id: number, update: UpdateClassroomDTO) {
    const isUpdated = await this.classroomRepository.update(id, update);

    if (!isUpdated) throw new Error('Cannot update the classroom');

    return isUpdated;
  }
}