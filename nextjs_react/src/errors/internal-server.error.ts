export class InternalServerError implements Error {
    constructor(message: string) {
        this.name = "INTERNAL_SERVER_ERROR";
        this.message = message;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    message: string;
    name: string;
}