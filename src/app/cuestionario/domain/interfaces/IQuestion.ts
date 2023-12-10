import { CreateQuestionDTO, CreateResponse, GetResponse, UpdateQuestionDTO } from '../dto/QuestionDTO';

export interface IQuestions {
    get(id: number): Promise<GetResponse | null>
    getAll(): Promise<GetResponse[] | null>
    create(createDTO: CreateQuestionDTO): Promise<CreateResponse | null>
    update(id: number, updateDTO: UpdateQuestionDTO): Promise<boolean>
    delete(id: number): Promise<boolean>   
}