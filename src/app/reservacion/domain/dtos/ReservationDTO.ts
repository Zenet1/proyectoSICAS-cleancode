export interface ReservationDTO {
    IDAlumno: number
    materias: MateriaDTO[]
}

export interface MateriaDTO {
    IDCarga: number
    HoraInicioHorario: string
    HoraFinHorario: string
}