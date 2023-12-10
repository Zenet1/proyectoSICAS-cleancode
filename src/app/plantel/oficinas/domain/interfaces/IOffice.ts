import { CreateOfficeDTO, UpdateOfficeDTO, GetOfficeResponse } from "../dto/OfficeDTO"

export interface IOffice {
    get(id: number): Promise<GetOfficeResponse | null>
    getAll(): Promise<GetOfficeResponse[]>
    create(createOfficeDTO: CreateOfficeDTO): Promise<GetOfficeResponse | null>
    update(id: number, updateOfficeDTO: UpdateOfficeDTO): Promise<boolean>
    delete(id: number): Promise<boolean>
}