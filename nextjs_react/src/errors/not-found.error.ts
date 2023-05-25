export class NotFoundError implements Error {
    constructor(message: string) {
        this.name = "NOT_FOUND";
        this.message = message;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    message: string;
    name: string;
}