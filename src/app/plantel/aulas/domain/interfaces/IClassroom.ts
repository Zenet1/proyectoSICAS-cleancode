import { CreateClassroomDTO, UpdateClassroomDTO, GetClassroomResponse } from "../dto/ClassroomDTO"

export interface IClassroom {
    create(createClassroomDTO: CreateClassroomDTO): Promise<GetClassroomResponse | null>
    update(id:number, updateClassroomDTO: UpdateClassroomDTO): Promise<boolean>
    get(id: number): Promise<GetClassroomResponse | null>
    getAll(): Promise<GetClassroomResponse[]>
}