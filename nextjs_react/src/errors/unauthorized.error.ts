export class UnauthorizedError implements Error {
    constructor(message: string) {
        this.name = "UNAUTHORIZED";
        this.message = message;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    message: string;
    name: string;
}