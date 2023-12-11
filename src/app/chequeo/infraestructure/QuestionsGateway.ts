import { FilteredQuestionsDTO } from '../domain/dtos/FilteredQuestionsDTO';
import { IQuestions } from '../domain/interfaces/IQuestions';

export class QuestionsGateway implements IQuestions {
  getAll(): Promise<FilteredQuestionsDTO | null> {
    const apiUrl = 'http://localhost:4444/healt';
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
        return data.data;
      })
      .catch(() => {
        return null;
      });
  }
}
