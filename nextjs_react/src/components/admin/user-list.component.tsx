import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {UserFormComponent} from "@/components/admin/user-form.component";
import {UserInfoComponent} from "@/components/admin/user-info.component";
import {SearchComponent} from "@/components/page/search.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {Table, Toast} from "react-bootstrap";
import styles from "@/styles/admin.module.sass";

export function UserListComponent({setError}: any) {
    let [users, setUsers] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({size: 10});
    let [user, setUser] = useState<any>();
    let [search, setSearch] = useState("");
    let [notification, setNotification] = useState<string>();
    const loadUsers = async () => {
        try {
            let usersData = await ApiManager.get("/api/users", {
                filter: search.length > 0 ? search : undefined,
                page: pageable.page,
                size: pageable.size,
                sort: pageable.sort && pageable.order ? `${pageable.sort},${pageable.order}` : undefined
            });
            if (usersData) {
                setUsers(usersData.content);
                setTotal(usersData.total);
                setPageable(usersData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const handleSort = (sort: string) => {
        pageable.sort = sort;
        pageable.order = pageable.sort !== sort || pageable.order === "desc" ? "asc" : "desc";
        loadUsers();
    }
    const editUser = async (id: number, userDto: any) => {
        await ApiManager.patch(`/api/users/${id}`, userDto);
        setUser(null);
        setNotification("Пользователь успешно изменен!");
        loadUsers();
    }
    useEffect(() => {
        loadUsers();
    }, []);
    return <div className={"d-flex flex-column h-100"}>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Администратор: пользователи</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        <UserFormComponent setError={setError} user={user}
                           editUser={(userDto: any) => editUser(user?.id, userDto)}
                           onClose={() => setUser(null)}/>
        <div className={"p-3"}></div>
        <SearchComponent search={search} setSearch={setSearch} submit={() => {
            pageable.page = 0;
            loadUsers();
        }}/>
        {users ? <>
            {total > 0 ? <>
                <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                    pageable.page = page;
                    loadUsers();
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
                                Имя{pageable.sort === "name" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("email")}>
                                Почта{pageable.sort === "email" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("phone")}>
                                Телефон{pageable.sort === "phone" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("blocked")}>
                                Статус{pageable.sort === "blocked" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"} className={styles["pointer"]}
                                onClick={() => handleSort("role_id")}>
                                Роль{pageable.sort === "role_id" ? (pageable.order === "asc" ? " ▲" : " ▼") : null}
                            </th>
                            <th scope={"col"}></th>
                        </tr>
                        </thead>
                        <tbody className={"table-group-divider"}>
                        {users.map((user: any) =>
                            <UserInfoComponent key={user.id} user={user}
                                               editUser={() => setUser(user)}/>)}
                        </tbody>
                    </Table>
                </div>
            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                <div className={"fs-3"}>Список пользователей пуст</div>
            </div>}
        </> : <SpinnerComponent size={"lg"}/>}
    </div>;
}