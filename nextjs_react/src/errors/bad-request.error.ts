export class BadRequestError implements Error {
    constructor(message: string) {
        this.name = "BAD_REQUEST";
        this.message = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    message: string;
    name: string;
}