import { MateriaDTO } from '../dtos/ReservationDTO';
import { SubjectDTO } from '../dtos/SubjectDTO';

export function ConvertSubjectToMateria(subjects: SubjectDTO[]): MateriaDTO[] {
  return subjects.map((subject) => ({
    IDCarga: subject.idLoad,
    HoraInicioHorario: subject.startTime,
    HoraFinHorario: subject.endTime,
  }));
}
