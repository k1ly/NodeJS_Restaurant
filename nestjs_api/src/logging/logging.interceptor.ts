import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, tap, throwError } from "rxjs";
import { LoggingService } from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggingService) {
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    return next.handle().pipe(
      tap(() => {
        if (method !== "GET")
          this.loggerService.log(`${context.getClass().name}::${context.getHandler().name} - ${method} ${originalUrl}`);
      }),
      catchError(error => {
        this.loggerService.error(`${context.getClass().name}::${context.getHandler().name} - ${error.message}`);
        return throwError(error);
      }));
  }
}
