export interface ICapacity {
    update(percentage: number): Promise<number | null>, get(): Promise<number | null>
}