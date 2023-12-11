import { SubjectDTO } from '../dtos/SubjectDTO';

export interface ISubject {
    getByStudentId(studentID: number): Promise<SubjectDTO[] | null>;
}