import { formatTime } from 'src/app/utils/FormatTime';
import { SubjectDTO } from '../domain/dtos/SubjectDTO';
import { ISubject } from '../domain/interfaces/ISubject';

export class SubjectGateway implements ISubject {
  getByStudentId(studentID: number): Promise<SubjectDTO[] | null> {
    const apiUrl = `http://localhost:4444/student/reserve/${studentID}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch(apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La solicitud falló con código de estado: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        const subjectsFormatted: SubjectDTO[] = data.data.map((subject) => ({
          ...subject,
          endTime: formatTime(subject.endTime),
          startTime: formatTime(subject.startTime),
        }));
        return subjectsFormatted;
      })
      .catch(() => {
        return null;
      });
  }
}
