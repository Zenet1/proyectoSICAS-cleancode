export interface CreateClassroomDTO {
    nombre: string
    capacidad: number
    id_edificio?: number
}

export interface UpdateClassroomDTO {
    nombre?: string,
    id_edificio?: number,
    capacidad?: number
}

export type GetClassroomResponse = {
    IDSalon: number;
    NombreSalon: string;
    Capacidad: number;
    edificio?: {
        IDEdificio: number;
        NombreEdificio: string;
    };
}