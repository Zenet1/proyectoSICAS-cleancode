import { ICapacity } from "../interfaces/ICapacity";

export class CapacityHandlerCase {
    constructor(private readonly capacityRepository: ICapacity) { }

    async getPercentage() {
        const result = await this.capacityRepository.get()

        if (result === null) throw new Error(`Doesnt exist an active percentage`)

        return result
    }

    async updatePercentage(percentage: number) {
        const result = await this.capacityRepository.update(percentage)

        if (result === null) throw new Error(`Cannot update percentage`)

        return result
    }
}