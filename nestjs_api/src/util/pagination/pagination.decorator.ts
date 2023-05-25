import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Pageable } from "./pagination.pageable";

export const Pagination = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let pageable = new Pageable();
    pageable.page = Number(request.query.page) || 0;
    pageable.size = Number(request.query.size) || 4;
    let [sort, order] = request.query.sort?.split(",") ?? [];
    pageable.sort = sort?.length > 0 ? sort : "id";
    pageable.order = order !== "desc" ? "asc" : "desc";
    return pageable;
  });