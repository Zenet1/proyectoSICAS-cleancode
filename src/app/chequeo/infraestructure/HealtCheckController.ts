import { FilteredQuestionsDTO } from '../domain/dtos/FilteredQuestionsDTO';
import { QuestionsGateway } from './QuestionsGateway';
import { HealtCheckQuestionsCase } from '../domain/usecase/HealtCheckQuestionsCase';
import { FilteredAnswersDTO } from '../domain/dtos/FilteredAnswersDTO';

export class HealtCheckController {
  public async checkQuestions(answers: FilteredAnswersDTO) {
    const response = await new HealtCheckQuestionsCase(
      new QuestionsGateway()
    ).canAccess(answers);
    return response;
  }

  public async getAll(): Promise<FilteredQuestionsDTO> {
    const response = await new QuestionsGateway().getAll();
    return response;
  }
}
