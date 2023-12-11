import { GetVisitorIDResponse, VisitorSessionDTO } from '../dtos/VisitorDTO';

export function convertToVisitorSession(
  visitorID: GetVisitorIDResponse,
  visitorEmail: string
): VisitorSessionDTO {
  return {
    IDExterno: visitorID.IDExterno,
    correo: visitorEmail,
  };
}
