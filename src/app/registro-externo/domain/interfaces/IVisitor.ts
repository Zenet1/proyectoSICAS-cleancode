import { VisitorDTO, GetVisitorIDResponse} from '../dtos/VisitorDTO';

export interface IVisitor {
    auth(dataVisitor: VisitorDTO): Promise<GetVisitorIDResponse | null>
}