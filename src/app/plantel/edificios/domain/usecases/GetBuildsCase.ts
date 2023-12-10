import { IBuild } from "../interfaces/IBuild";

export class GetBuildsCase {
    constructor(private readonly buildRepository: IBuild) { }

    async getAllBuilds() {
        return await this.buildRepository.getAll()
    }
}