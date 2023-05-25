export class ForbiddenError implements Error {
    constructor(message: string) {
        this.name = "FORBIDDEN";
        this.message = message;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    message: string;
    name: string;
}