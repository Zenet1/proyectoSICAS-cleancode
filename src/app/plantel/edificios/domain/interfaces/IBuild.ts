import { GetBuildResponse} from "../dto/BuildDTO"

export interface IBuild {
    getAll(): Promise<GetBuildResponse[]>
}