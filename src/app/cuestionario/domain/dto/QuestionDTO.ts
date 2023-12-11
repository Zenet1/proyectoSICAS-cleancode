export interface CreateQuestionDTO {
    pregunta: string,
    respuesta: string,
    enlace?: number
}

export interface UpdateQuestionDTO {
    pregunta?: string,
    respuesta?: string,
    enlace?: number
}

export type CreateResponse = { Respuesta: string, Pregunta: string, Enlace: number | null }
export type GetResponse = { IDPregunta: number, Respuesta: string, Pregunta: string, Enlace: number | null }