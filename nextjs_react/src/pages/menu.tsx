import {PageComponent} from "@/components/page/page.component";
import {DishListComponent} from "@/components/menu/dish-list.component";
import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import {Col, Row} from "react-bootstrap";
import CategoryListComponent from "@/components/menu/category-list.component";
import "bootstrap/dist/css/bootstrap.min.css";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";
import {useRouter, useSearchParams} from "next/navigation";
import {ApiManager} from "@/util/api.manager";
import queryString from "query-string";

export default function Menu() {
    let [error, setError] = useState<Error>();
    let [auth, setAuth] = useState<any>();
    let [category, setCategory] = useState<any>();
    let [filter, setFilter] = useState<string>();
    let [page, setPage] = useState<number>();
    let [size, setSize] = useState<number>();
    let [sort, setSort] = useState<string>();
    let router = useRouter();
    let query = useSearchParams();
    const loadCategory = async () => {
        try {
            let categoryData = await ApiManager.get(`/api/categories/${query.get("category")}`);
            if (categoryData)
                setCategory(categoryData);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        (async () => {
            try {
                let authData = await AuthManager.authenticate();
                if (authData)
                    setAuth(authData);
            } catch (error: any) {
                setError(error);
            }
        })();
    }, []);
    useEffect(() => {
        let category = query.get("category") ? Number(query.get("category")) : undefined;
        let filter = query.get("filter") ? query.get("filter") : undefined;
        let page = query.get("page") ? Number(query.get("page")) : undefined;
        let size = query.get("size") ? Number(query.get("size")) : undefined;
        let sort = query.get("sort") ? query.get("sort") : undefined;
        if ((category && Number.isNaN(category) && category < 1) ||
            (page && Number.isNaN(page) && page < 0) ||
            (size && Number.isNaN(size) && size < 0) ||
            (sort && !sort.match(/^(name|price|discount),(asc|desc)$/)))
            router.push("?");
        setCategory(undefined);
        setFilter(undefined);
        setPage(page);
        setSize(size);
        setSort(sort);
        if (category) {
            if (filter)
                router.push(`?${queryString.stringify({category, size, sort})}`);
            else loadCategory();
        } else if (filter)
            setFilter(filter);
    }, [query]);
    return <ErrorHandlerComponent error={error}>
        <PageComponent setError={setError} auth={auth}>
            <Row className={"mx-0 h-100"}>
                <Col lg={3} className={"h-100"}>
                    <CategoryListComponent setError={setError} category={category} size={size} sort={sort}/>
                </Col>
                <Col className={"h-100"}>
                    <DishListComponent setError={setError} auth={auth}
                                       category={category} filter={filter} page={page} size={size} sort={sort}/>
                </Col>
            </Row>
        </PageComponent>
    </ErrorHandlerComponent>;
}