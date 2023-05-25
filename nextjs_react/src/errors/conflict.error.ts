export class ConflictError implements Error {
    constructor(message: string) {
        this.name = "CONFLICT";
        this.message = message;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }

    message: string;
    name: string;
}