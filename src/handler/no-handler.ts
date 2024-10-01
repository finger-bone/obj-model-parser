export class NoHandlerError extends Error {
    constructor(request: string) {
        super(`No handler found for request: ${request}`);
    }
}