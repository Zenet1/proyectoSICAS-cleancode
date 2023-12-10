import { CreateClassroomDTO, GetClassroomResponse, UpdateClassroomDTO } from '../domain/dto/ClassroomDTO';
import { IClassroom } from '../domain/interfaces/IClassroom';

export class AulaGateway implements IClassroom {
  private readonly apiUrl = 'http://localhost:4444/classrooms';
  constructor(){}

  async get(id: number): Promise<GetClassroomResponse | null>{
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`La solicitud para obtener el classroom con ID ${id} falló con código de estado: ${response.status}`);
    }
    const result = await response.json();
    return result;    
        
  }
  async getAll(): Promise<GetClassroomResponse[]> {
    const response = await fetch(`${this.apiUrl}/`);
    if (!response.ok) {
      throw new Error('La solicitud para obtener todas las aulas falló');
    }
    const result = await response.json();
    return result;
  }
  async create(createClassroomDTO: CreateClassroomDTO): Promise<GetClassroomResponse> {
    const response = await fetch(`${this.apiUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createClassroomDTO),
    });
    if (!response.ok) {
      throw new Error('La solicitud para crear un classroom falló');
    }
    const result = await response.json();
    return result;
  }
  async update(id: number, updateClassroomDTO: UpdateClassroomDTO): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateClassroomDTO),
    });
    if (!response.ok) {
      throw new Error(`La solicitud para actualizar el classroom con ID ${id} falló`);
    }
    const result = await response.json();
    return result.ok;
  }
  
}