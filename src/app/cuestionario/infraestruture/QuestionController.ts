import { QuestionCase } from '../domain/usecases/CRUDQuestionCase';
import { CreateQuestionDTO, UpdateQuestionDTO, CreateResponse, GetResponse } from '../domain/dto/QuestionDTO';
import { QuestionGateway } from './QuestionGateway';

export class QuestionController {
  async createQuestion(createDTO: CreateQuestionDTO): Promise<CreateResponse> {
    const res = await new QuestionCase(new QuestionGateway()).CreateQuestion(createDTO);
    return res;
  }

  async getQuestion(id: number): Promise<GetResponse> {
    const res = await new QuestionCase(new QuestionGateway()).GetQuestion(id);
    return res;
  }

  async getAllQuestions(): Promise<GetResponse[]> {
    const res = await new QuestionCase(new QuestionGateway()).GetQuestions();
    return res;
  }

  async updateQuestion(questionID: number, updateDTO: UpdateQuestionDTO): Promise<boolean> {
    const res = await new QuestionCase(new QuestionGateway()).UpdateQuestion(questionID, updateDTO);
    return res;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const res = await new QuestionCase(new QuestionGateway()).DeleteQuestion(id);
    return res;
  }
}
