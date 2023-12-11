import { VirtualTimeScheduler } from 'rxjs';
import { GetVisitorIDResponse, VisitorDTO } from '../../domain/dtos/VisitorDTO';
import { convertToVisitorSession } from '../../domain/mappers/ConvertToVisitorSession';
import { RegisterVisitorCase } from '../../domain/usecases/RegisterVisitorCase';
import { visitorGateway } from '../gateways/VisitorGateway';

export class VisitorController {
  public async auth(visitorData: VisitorDTO): Promise<void> {
    const response: GetVisitorIDResponse = await new RegisterVisitorCase(
      new visitorGateway()
    ).authVisitor(visitorData);
    const visitorSession = convertToVisitorSession(response, visitorData.correo);
    sessionStorage.setItem('externo', JSON.stringify(visitorSession));
  }

  public getItem (): GetVisitorIDResponse {
    return JSON.parse(sessionStorage.getItem('externo'));
  }
}
