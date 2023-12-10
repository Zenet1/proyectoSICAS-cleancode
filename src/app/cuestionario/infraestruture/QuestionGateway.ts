import { CreateQuestionDTO, UpdateQuestionDTO, CreateResponse, GetResponse } from '../domain/dto/QuestionDTO';
import { IQuestions } from '../domain/interfaces/IQuestion';

export class QuestionGateway implements IQuestions {
  private readonly apiUrl = 'http://localhost:4444/questions';
  constructor() {}

  async get(id: number): Promise<GetResponse | null> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`La solicitud para obtener la pregunta con ID ${id} falló con código de estado: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }

  async getAll(): Promise<GetResponse[] | null> {
    const response = await fetch(`${this.apiUrl}/`);
    if (!response.ok) {
      throw new Error('La solicitud para obtener todas las preguntas falló');
    }
    const result = await response.json();
    return result;
  }

  async create(createDTO: CreateQuestionDTO): Promise<CreateResponse | null> {
    const response = await fetch(`${this.apiUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createDTO),
    });
    if (!response.ok) {
      throw new Error('La solicitud para crear una pregunta falló');
    }
    const result = await response.json();
    return result;
  }

  async update(id: number, updateDTO: UpdateQuestionDTO): Promise<boolean>{
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDTO),
    });
    if (!response.ok) {
      throw new Error(`La solicitud para actualizar la pregunta con ID ${id} falló`);
    }
    const result = await response.json();
    return result.ok;
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
