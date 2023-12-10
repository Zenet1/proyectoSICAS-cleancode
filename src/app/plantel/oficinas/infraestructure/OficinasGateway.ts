import { CreateOfficeDTO, GetOfficeResponse, UpdateOfficeDTO } from '../domain/dto/OfficeDTO';
import { IOffice } from '../domain/interfaces/IOffice';

export class OficinasGateway implements IOffice {
  private readonly apiUrl = 'http://localhost:4444/offices';
    
  constructor(){}
  async get(id: number): Promise<GetOfficeResponse> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`La solicitud falló con código de estado: ${response.status}`);
    }
    const result = await response.json();
    return result; 
  }

  async getAll(): Promise<GetOfficeResponse[]> {
    const response = await fetch(`${this.apiUrl}/`);
    if (!response.ok) {
      throw new Error('La solicitud falló');
    }
    const result = await response.json();
    return result;    
  }

  async create(createOfficeDTO: CreateOfficeDTO): Promise<GetOfficeResponse> {
    const response = await fetch(`${this.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createOfficeDTO),
    });
    if (!response.ok) {
      throw new Error('La solicitud falló');
    }
    const result = await response.json();
    return result;    
  }
    
  async update(id: number, updateOfficeDTO: UpdateOfficeDTO): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateOfficeDTO),
    });
    if (!response.ok) {
      throw new Error('La solicitud falló');
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