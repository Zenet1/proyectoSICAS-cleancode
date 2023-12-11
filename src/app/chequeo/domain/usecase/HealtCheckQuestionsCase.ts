import { QuestionsGateway } from '../../infraestructure/gateways/QuestionsGateway';
import { FilteredAnswersDTO } from '../dtos/FilteredAnswersDTO';
import { FilteredQuestionsDTO } from '../dtos/FilteredQuestionsDTO';

export class HealtCheckQuestionsCase {
  constructor(private readonly questionsGateway: QuestionsGateway) {}

  async canAccess (answers: FilteredAnswersDTO): Promise<boolean> {
    const questions: FilteredQuestionsDTO = await this.questionsGateway.getAll();
    if (questions === null) throw new Error('No Questions');
    let amountIncorrect: number = 0;
    let hasSecondary: boolean = false;
    for (let mainIndex = 0; mainIndex < answers.primarias.length; mainIndex++) {
      if (
        answers.primarias[mainIndex].answer !=
        questions.primarias[mainIndex].Respuesta
      ) {
        for (let secondaryIndex = 0; secondaryIndex < answers.secundarias.length; secondaryIndex++) {
          if (
            questions.secundarias[secondaryIndex].Enlace ==
            questions.primarias[mainIndex].IDPregunta
          ) {
            hasSecondary = true;
            if (
              answers.secundarias[secondaryIndex].answer != ''
            ) {
              if (
                answers.secundarias[secondaryIndex].answer != questions.secundarias[secondaryIndex].Respuesta
              ) {
                amountIncorrect++;
              }
            }
          }
        }
        if (!hasSecondary) {
          amountIncorrect++;
        }
      }
      hasSecondary = false;
    }
    return (amountIncorrect === 0) ? true : false;
  }
}
