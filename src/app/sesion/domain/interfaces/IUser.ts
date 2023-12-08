export interface IUser {
    GetID(userID: number): Promise<number | null>
}