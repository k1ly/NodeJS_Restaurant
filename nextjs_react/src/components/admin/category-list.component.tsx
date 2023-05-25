import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {CategoryFormComponent} from "@/components/admin/category-form.component";
import {SearchComponent} from "@/components/page/search.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {CategoryInfoComponent} from "@/components/admin/category-info.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {Button, Table, Toast} from "react-bootstrap";
import styles from "@/styles/admin.module.sass";

export function CategoryListComponent({setError}: any) {
    let [categories, setCategories] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({size: 10});
    let [category, setCategory] = useState<any>();
    let [search, setSearch] = useState("");
    let [notification, setNotification] = useState<string>();
    const loadCategories = async () => {
        try {
            let categoriesData = await ApiManager.get("/api/categories", {
                filter: search?.length > 0 ? search : undefined,
                page: pageable.page,
                size: pageable.size,
                sort: pageable.sort && pageable.order ? `${pageable.sort},${pageable.order}` : undefined
            });
            if (categoriesData) {
                setCategories(categoriesData.content);
                setTotal(categoriesData.total);
                setPageable(categoriesData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order = pageable.sort !== sort || pageable.order === "desc" ? "asc" : "desc";
        loadCategories();
    }
    const addCategory = async (categoryDto: any) => {
        await ApiManager.post("/api/categories", categoryDto);
        setCategory(null);
        setNotification("Категория успешно добавлена!");
        loadCategories();
    }
    const updateCategory = async (id: number, categoryDto: any) => {
        await ApiManager.put(`/api/categories/${id}`, categoryDto);
        setCategory(null);
        setNotification("Категория успешно изменена!");
        loadCategories();
    }
    const deleteCategory = async (id: number) => {
        try {
            await ApiManager.delete(`/api/categories/${id}`)
            setNotification("Категория успешно удалена!");
            loadCategories();
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadCategories();
    }, []);
    return <div className={"d-flex flex-column h-100"}>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Администратор: категории</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        <CategoryFormComponent setError={setError} category={category}
                               addCategory={(categoryDto: any) => addCategory(categoryDto)}
                               updateCategory={(categoryDto: any) => updateCategory(category?.id, categoryDto)}
                               onClose={() => setCategory(null)}/>
        <div className={"p-4"}>
            <Button variant={"success"} className={"px-2 w-100 fs-4"}
                    onClick={() => setCategory({})}>
                Добавить категорию
            </Button>
        </div>
        <SearchComponent search={search} setSearch={setSearch} submit={() => {
            pageable.page = 0;
            loadCategories();
        }}/>
        {categories ? <>
            {total > 0 ? <>
                <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                    pageable.page = page;
                    loadCategories();
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
                            <th scope={"col"}></th>
                        </tr>
                        </thead>
                        <tbody className={"table-group-divider"}>
                        {categories.map((category: any) =>
                            <CategoryInfoComponent key={category.id} category={category}
                                                   updateCategory={() => setCategory(category)}
                                                   deleteCategory={() => {
                                                       deleteCategory(category.id);
                                                   }}/>)}
                        </tbody>
                    </Table>
                </div>
            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                <div className={"fs-3"}>Список категорий пуст</div>
            </div>}
        </> : <SpinnerComponent size={"lg"}/>}
    </div>;
}