export interface Handler<T> {
    handle(request: string[], lineIndex: number): [T, number];
    canHandle(request: string[], lineIndex: number): boolean;
}

