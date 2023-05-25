import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";

export const Cookies = createParamDecorator(
  (data: { name: string, type?: ClassConstructor<any> }, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (data) {
      let cookies = request.cookies?.[data.name];
      if (cookies && data.type)
        return plainToInstance(data.type, JSON.parse(cookies));
      return cookies;
    }
    return request.cookies;
  }
);