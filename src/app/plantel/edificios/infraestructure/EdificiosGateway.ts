import { GetBuildResponse } from '../domain/dto/BuildDTO';
import { IBuild } from '../domain/interfaces/IBuild';

export class EdificiosGateway implements IBuild{
  private readonly apiUrl = 'http://localhost:4444/builds';
  constructor(){}
  async getAll(): Promise<GetBuildResponse[]> {
    const response = await fetch(`${this.apiUrl}`);
    if (!response.ok) {
      throw new Error('La solicitud para obtener todas las aulas falló');
    }
    const result = await response.json();
    return result;
  }
}