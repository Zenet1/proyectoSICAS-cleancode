import { AnswerDTO } from '../dtos/AnswerDTO';
import { FilteredAnswersDTO } from '../dtos/FilteredAnswersDTO';

export function convertToFilteredAnswers(
  answers: AnswerDTO[],
  secondaryAnswers: AnswerDTO[]
): FilteredAnswersDTO {
  return {
    primarias: answers,
    secundarias: secondaryAnswers,
  };
}
