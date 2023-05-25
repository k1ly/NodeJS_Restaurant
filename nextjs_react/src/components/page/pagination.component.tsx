import {Pagination} from "react-bootstrap";
import {log} from "util";

export type Pageable = { page?: number, size?: number, sort?: string, order?: "asc" | "desc" }

export function PaginationComponent({total, pageable, setPage}: any) {
    return <Pagination className={"ms-4"}>
        {pageable.page ? <>
            {pageable.page > 0 ? <Pagination.Item onClick={() => setPage(0)}>
                {1}
            </Pagination.Item> : null}
            {pageable.page > 2 ? <Pagination.Ellipsis disabled={true}/> : null}
            {pageable.page > 1 ? <Pagination.Item onClick={() => setPage(pageable.page - 1)}>
                {pageable.page}
            </Pagination.Item> : null}
        </> : null}
        <Pagination.Item active={true} onClick={() => setPage(pageable.page ?? 0)}>
            {(pageable.page ?? 0) + 1}
        </Pagination.Item>
        {pageable && total ? <>
            {pageable.page < (total - 1) ? <Pagination.Item onClick={() => setPage(pageable.page + 1)}>
                {pageable.page + 2}
            </Pagination.Item> : null}
            {pageable.page < (total - 3) ? <Pagination.Ellipsis disabled={true}/> : null}
            {pageable.page < (total - 2) ? <Pagination.Item onClick={() => setPage(total - 1)}>
                {total}
            </Pagination.Item> : null}
        </> : null}
    </Pagination>;
}