export interface CreateOfficeDTO {
    nombre: string
    departamento: string
    id_edificio: number
}

export interface UpdateOfficeDTO {
    id: number,
    nombre?: string,
    departamento?: string,
    id_edificio?: number
}

export type GetOfficeResponse = {
    IDOficina: number;
    NombreOficina: string;
    Departamento: string;
    edificio: {
        IDEdificio: number;
        NombreEdificio: string;
    };
}