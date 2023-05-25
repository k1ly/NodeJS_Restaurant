import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {SearchComponent} from "@/components/page/search.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {DishFormComponent} from "@/components/admin/dish-form.component";
import {DishInfoComponent} from "@/components/admin/dish-info.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {Button, Table, Toast} from "react-bootstrap";
import styles from "@/styles/admin.module.sass";

export function DishListComponent({setError}: any) {
    let [dishes, setDishes] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({size: 10});
    let [dish, setDish] = useState<any>();
    let [search, setSearch] = useState("");
    let [notification, setNotification] = useState<string>();
    const loadDishes = async () => {
        try {
            let dishesData = await ApiManager.get("/api/dishes", {
                filter: search.length > 0 ? search : undefined,
                page: pageable.page,
                size: pageable.size,
                sort: pageable.sort && pageable.order ? `${pageable.sort},${pageable.order}` : undefined
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
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order = pageable.sort !== sort || pageable.order === "desc" ? "asc" : "desc";
        loadDishes();
    }
    const saveImage = async (image: any) => {
        let formData = new FormData();
        formData.append("image", image);
        return await ApiManager.send("/api/dishes/save", formData);
    }
    const addDish = async (dishDto: any, image: any) => {
        if (image)
            dishDto.imageUrl = await saveImage(image);
        await ApiManager.post("/api/dishes", dishDto);
        setDish(null);
        setNotification("Блюдо успешно добавлено!");
        loadDishes();
    }
    const updateDish = async (id: number, dishDto: any, image: any) => {
        if (image)
            dishDto.imageUrl = await saveImage(image);
        await ApiManager.put(`/api/dishes/${id}`, dishDto)
        setDish(null);
        setNotification("Блюдо успешно изменено!");
        loadDishes();
    }
    const deleteDish = async (id: number) => {
        try {
            await ApiManager.delete(`/api/dishes/${id}`);
            setDish(null);
            setNotification("Блюдо успешно удалено!");
            loadDishes();
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadDishes();
    }, []);
    return <div className={"d-flex flex-column h-100"}>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Администратор: блюда</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        {dish ? <DishFormComponent setError={setError} dish={dish}
                                   addDish={(dishDto: any, image: any) => addDish(dishDto, image)}
                                   updateDish={(dishDto: any, image: any) => updateDish(dish?.id, dishDto, image)}
                                   onClose={() => setDish(null)}/> : null}
        <div className={"p-4"}>
            <Button variant={"success"} className={"px-2 w-100 fs-4"}
                    onClick={() => setDish({})}>
                Добавить блюдо
            </Button>
        </div>
        <SearchComponent search={search} setSearch={setSearch} submit={() => {
            pageable.page = 0;
            loadDishes();
        }}/>
        {dishes ? <>
            {total > 0 ? <>
                <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                    pageable.page = page;
                    loadDishes();
                }}/>
                <div className={"flex-fill mx-5"}>
                    <Table striped={true} hover={true} className={"w-100"}>
                        <thead className={"table-light fw-bold"}>
                        <tr>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("id")}>
                                ID{pageable.sort === "id" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("name")}>
                                Название{pageable.sort === "name" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("weight")}>
                                Вес{pageable.sort === "weight" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("price")}>
                                Цена{pageable.sort === "price" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("discount")}>
                                Скидка{pageable.sort === "discount" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("category_id")}>
                                Категория{pageable.sort === "category_id" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"}></th>
                        </tr>
                        </thead>
                        <tbody className={"table-group-divider"}>
                        {dishes.map(dish =>
                            <DishInfoComponent key={dish.id} setError={setError}
                                               dish={dish}
                                               updateDish={() => setDish(dish)}
                                               deleteDish={() => {
                                                   deleteDish(dish.id);
                                               }}/>)}
                        </tbody>
                    </Table>
                </div>
            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                <div className={"fs-3"}>Список блюд пуст</div>
            </div>}
        </> : <SpinnerComponent size={"lg"}/>}
    </div>;
}