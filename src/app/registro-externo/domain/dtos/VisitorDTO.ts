export interface VisitorDTO {
    nombres: string
    apellidos: string
    empresa: string
    correo: string
}

export type GetVisitorIDResponse = {
    IDExterno: number;
}