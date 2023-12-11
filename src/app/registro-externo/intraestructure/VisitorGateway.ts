import { GetVisitorIDResponse, VisitorDTO } from '../domain/dtos/VisitorDTO';
import { IVisitor } from '../domain/interfaces/IVisitor';

export class visitorGateway implements IVisitor {
  public async auth(
    visitorDTO: VisitorDTO
  ): Promise<GetVisitorIDResponse | null> {
    const apiUrl = 'http://localhost:4444/visitor';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitorDTO),
    };
    try {
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(
          `La solicitud falló con código de estado: ${response.status}`
        );
      }
      const data = await response.json();
      console.log(data.data);
      return data.data;
    } catch {
      return null;
    }
  }
}
