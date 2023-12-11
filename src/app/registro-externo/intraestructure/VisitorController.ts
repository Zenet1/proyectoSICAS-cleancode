import { GetVisitorIDResponse, VisitorDTO } from '../domain/dtos/VisitorDTO';
import { RegisterVisitorCase } from '../domain/usecases/RegisterVisitorCase';
import { visitorGateway } from './VisitorGateway';

export class VisitorController {
  public async auth(visitorData: VisitorDTO): Promise<GetVisitorIDResponse> {
    const response: GetVisitorIDResponse = await new RegisterVisitorCase(
      new visitorGateway()
    ).authVisitor(visitorData);
    sessionStorage.setItem('externo', JSON.stringify(response));
    return response;
  }

  public getItem (): GetVisitorIDResponse {
    return JSON.parse(sessionStorage.getItem('externo'));
  }
}
