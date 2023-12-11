import { GetVisitorIDResponse, VisitorDTO } from '../dtos/VisitorDTO';
import { IVisitor } from '../interfaces/IVisitor';

export class RegisterVisitorCase {
  constructor(private readonly visitorGateway: IVisitor) {}

  public async authVisitor(createDTO: VisitorDTO): Promise<GetVisitorIDResponse> {
    const result = await this.visitorGateway.auth(createDTO);
    if (result === null) throw new Error('Cannot create the visitor');
    return result;
  }
}
