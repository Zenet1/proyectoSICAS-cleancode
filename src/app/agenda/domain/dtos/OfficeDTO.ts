export type OfficeDTO = {
    IDOficina: number;
    NombreOficina: string;
    Departamento: string;
    edificio: {
        NombreEdificio: string;
    };
}

export interface OfficeIdDTO {
    IDOficina: number
}