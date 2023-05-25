import {UnauthorizedError} from "@/errors/unauthorized.error";
import {ForbiddenError} from "@/errors/forbidden.error";
import {NotFoundError} from "@/errors/not-found.error";
import {UnauthorizedComponent} from "@/components/error/401";
import {ForbiddenComponent} from "@/components/error/403";
import {NotFoundComponent} from "@/components/error/404";
import {InternalServerErrorComponent} from "@/components/error/500";

export function ErrorHandlerComponent({error, children}: any) {
    if (error)
        console.error(error);
    let statusCode = 500;
    if (error instanceof UnauthorizedError)
        statusCode = 401;
    if (error instanceof ForbiddenError)
        statusCode = 403;
    if (error instanceof NotFoundError)
        statusCode = 404;
    return error ? {
        401: <UnauthorizedComponent/>,
        403: <ForbiddenComponent/>,
        404: <NotFoundComponent/>,
        500: <InternalServerErrorComponent/>
    }[statusCode] : children;
}