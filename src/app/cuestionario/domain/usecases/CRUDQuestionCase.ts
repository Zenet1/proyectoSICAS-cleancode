import { CreateQuestionDTO, UpdateQuestionDTO } from '../dto/QuestionDTO';
import { IQuestions } from '../interfaces/IQuestion';

export class QuestionCase {
  constructor(private readonly questionRepository: IQuestions) { }

  async GetQuestion(id: number) {
    const result = await this.questionRepository.get(id);
    if (result === null) throw new Error(`Cannot get Question with ID ${id}`);
    return result;
  }

  async GetQuestions() {
    const result = await this.questionRepository.getAll();
    if (result === null) throw new Error('Cannot get Questions');
    return result;
  }

  async CreateQuestion(createDTO: CreateQuestionDTO) {
    const result = await this.questionRepository.create(createDTO);

    if (result === null) throw new Error('Cannot create question');

    return result;
  }

  async UpdateQuestion(questionID: number, updateDTO: UpdateQuestionDTO) {
    const result = await this.questionRepository.update(questionID, updateDTO);
    return result;
  }

  async DeleteQuestion(id: number) {
    const result = await this.questionRepository.delete(id);
    return result;
  }
}