import { CreateOfficeDTO, UpdateOfficeDTO } from "../dto/OfficeDTO";
import { IOffice } from "../interfaces/IOffice";

export class CRUDOfficeCase {
    constructor(private readonly officeRepository: IOffice) { }

    async getAllOffices() {
        const result = await this.officeRepository.getAll()
        return result
    }

    async getOfficeByID(id: number) {
        const result = await this.officeRepository.get(id)

        if (result === null) throw new Error('Cannot find office')

        return result
    }
    
    async createOffice(createDTO: CreateOfficeDTO) {
        const result = await this.officeRepository.create(createDTO)

        if (result === null) throw new Error('Cannot create the office')

        return result
    }

    async updateOffice(id: number, update: UpdateOfficeDTO) {
        const isUpdated = await this.officeRepository.update(id, update)

        if (!isUpdated) throw new Error('Cannot update the office')

        return isUpdated
    }
    
    async deleteOffice(id: number) {
        const result = await this.officeRepository.delete(id)
        return result
    }
}