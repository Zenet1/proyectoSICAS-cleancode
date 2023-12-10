import { ICapacity } from '../domain/interfaces/ICapacity';

export class CapacityGateway implements ICapacity{
  private readonly apiUrl = 'http://localhost:4444/capacity';

  async get(): Promise<number> {
    const response = await fetch(`${this.apiUrl}/`);
    if (!response.ok) {
      throw new Error('La solicitud falló');
    }
    const result = await response.json();
    return result;     
  }

  async update(percentage: number): Promise<number> {
    const response = await fetch(`${this.apiUrl}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({percentage}),
    });
    if (!response) {
      throw new Error('La solicitud falló');
    }
    const result = await response.json();
    return result;  
  }
}