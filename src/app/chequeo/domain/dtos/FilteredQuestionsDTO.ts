import { QuestionDTO } from './QuestionDTO';

export interface FilteredQuestionsDTO {
    primarias: QuestionDTO[]
    secundarias: QuestionDTO[]
}