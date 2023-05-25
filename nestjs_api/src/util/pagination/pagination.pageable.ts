export class Pageable {
  page: number;
  size: number;
  sort: string;
  order: "asc" | "desc";
}