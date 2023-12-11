import { FilteredQuestionsDTO } from '../dtos/FilteredQuestionsDTO';

export interface IQuestions {
    getAll(): Promise<FilteredQuestionsDTO | null>
}