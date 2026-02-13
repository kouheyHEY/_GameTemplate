/**
 * Generic Factory Interface
 */
export interface IFactory<T> {
    create(...args: any[]): T;
}

/**
 * Generic Entity Interface
 */
export interface IEntity {
    id: string;
    update(time: number, delta: number): void;
    destroy(): void;
}
