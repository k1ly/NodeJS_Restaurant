import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Auth = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);