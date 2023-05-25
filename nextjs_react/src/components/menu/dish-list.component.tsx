import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {DishInfoComponent} from "@/components/menu/dish-info.component";
import {SearchComponent} from "@/components/page/search.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {useRouter} from "next/navigation";
import queryString from "query-string";
import {Form, Stack, Toast} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/styles/admin.module.sass";

export function DishListComponent({setError, auth, category, filter, page, size, sort}: any) {
    let [dishes, setDishes] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({});
    let [search, setSearch] = useState(filter ?? "");
    let [notification, setNotification] = useState<string>();
    let router = useRouter();
    const loadDishes = async () => {
        try {
            let dishesData = await ApiManager.get("/api/dishes", {
                category: category?.id, filter, page, size, sort
            });
            if (dishesData) {
                setDishes(dishesData.content);
                setTotal(dishesData.total);
                setPageable(dishesData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const addOrderItem = async (id: number) => {
        if (auth) {
            try {
                await ApiManager.post(auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ? "/api/order-items" : "/cart", {
                    quantity: 1,
                    dish: id,
                    order: auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ? auth.order : undefined
                });
                setNotification("Добавлено в корзину!");
            } catch (error: any) {
                setError(error);
            }
        }
    }
    useEffect(() => {
        if (category || filter)
            loadDishes();
    }, [category, filter, page, size, sort]);
    return <div className={"h-100"}>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Корзина</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        <div className={"d-flex flex-column h-100"}>
            {category ? <div className={"my-3 border-3 border-bottom text-center text-white fs-2"}>
                {category.name}
            </div> : null}
            <SearchComponent search={search} setSearch={setSearch} submit={() =>
                router.push(`?${queryString.stringify({
                    filter: search?.length > 0 ? search : undefined, size, sort
                })}`)}/>
            {category || filter ? <>
                {dishes ? <>
                    {total > 0 ? <>
                        <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                            router.push(`?${queryString.stringify(({
                                category: category?.id, filter, page, size, sort
                            }))}`);
                        }}/>
                        <div className={"d-flex justify-content-end"}>
                            <div className={"d-flex"}>
                                <Form.Group className={"d-flex me-4"}>
                                    <Form.Label htmlFor={"sort"}
                                                className={"me-3 text-end text-nowrap text-white lh-lg"}>
                                        Сортировать по
                                    </Form.Label>
                                    <Form.Select name={"sort"}
                                                 value={pageable.sort}
                                                 onChange={(e: any) => {
                                                     let [attribute, order] = sort?.split(",") ?? [];
                                                     router.push(`?${queryString.stringify(({
                                                         category: category?.id, filter, size,
                                                         sort: `${e.target.value},${order === "desc" ? order : "asc"}`
                                                     }))}`);
                                                 }} id={"sort"}>
                                        <option value={null}>
                                            ...
                                        </option>
                                        <option value={"name"}>
                                            Имя
                                        </option>
                                        <option value={"price"}>
                                            Цена
                                        </option>
                                        <option value={"discount"}>
                                            Скидка
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className={"d-flex me-4"}>
                                    <Form.Select name={"order"}
                                                 value={pageable.order}
                                                 onChange={(e: any) => {
                                                     let [attribute, order] = sort?.split(",") ?? [];
                                                     router.push(`?${queryString.stringify(({
                                                         category: category?.id, filter, size,
                                                         sort: `${attribute?.length > 0 ? attribute : "name"},${e.target.value}`
                                                     }))}`);
                                                 }} id={"order"}>
                                        <option value={null} disabled={true}>
                                            ...
                                        </option>
                                        <option value={"asc"}>
                                            по возрастанию
                                        </option>
                                        <option value={"desc"}>
                                            по убыванию
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        <Stack className={"mt-2 flex-fill"}>
                            {dishes.map((dish: any) => <DishInfoComponent key={dish.id} setError={setError}
                                                                          dish={dish}
                                                                          addOrderItem={() => addOrderItem(dish.id)}/>)}
                        </Stack>
                    </> : <>
                        {category ? <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                            <div className={"text-white fs-4"}>Категория `{category.name}` пока пуста</div>
                        </div> : <>
                            {filter ? <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                                <div className={"text-white fs-4"}>
                                    По запросу `{filter}` ничего найдено
                                </div>
                            </div> : null}
                        </>}
                    </>}
                </> : <SpinnerComponent variant={"light"} size={"lg"}/>}
            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                <div className={"text-white fs-4"}>
                    Для того чтобы просмотреть меню выберите категорию или введите запрос
                </div>
            </div>}
        </div>
    </div>;
}