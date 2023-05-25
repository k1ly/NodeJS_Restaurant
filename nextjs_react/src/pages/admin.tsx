import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import {PageComponent} from "@/components/page/page.component";
import {DishListComponent} from "@/components/admin/dish-list.component";
import {CategoryListComponent} from "@/components/admin/category-list.component";
import {UserListComponent} from "@/components/admin/user-list.component";
import clsx from "classnames";
import styles from "@/styles/admin.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useSearchParams} from "next/navigation";
import queryString from "query-string";
import {Col, Nav, Row} from "react-bootstrap";
import Link from "next/link";
import {ForbiddenError} from "@/errors/forbidden.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function Admin() {
    let [error, setError] = useState<Error>();
    let [auth, setAuth] = useState<any>();
    let query = useSearchParams();
    useEffect(() => {
        (async () => {
            try {
                let authData = await AuthManager.authenticate();
                if (authData?.role?.match(/^(ADMIN)$/))
                    setAuth(authData);
                else setError(new ForbiddenError("Admin"));
            } catch (error: any) {
                setError(error);
            }
        })();
    }, []);
    return <ErrorHandlerComponent error={error}>
        <PageComponent setError={setError} auth={auth}>
            {auth ? <Row className={"mx-0 h-100"}>
                <Col lg={3}>
                    <div className={styles["tab-list"]}>
                        <Nav className={"flex-column"}>
                            <Nav.Item>
                                <Link href={`?${queryString.stringify({
                                    tab: "dishes"
                                })}`} className={"text-decoration-none"}>
                                    <Nav.Link as={"div"} className={clsx(styles["admin-nav-link"], {
                                        [styles["active"]]: query.get("tab") === "dishes"
                                    })}>
                                        Блюда
                                    </Nav.Link>
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link href={`?${queryString.stringify({
                                    tab: "categories"
                                })}`} className={"text-decoration-none"}>
                                    <Nav.Link as={"div"} className={clsx(styles["admin-nav-link"], {
                                        [styles["active"]]: query.get("tab") === "categories"
                                    })}>
                                        Категории блюд
                                    </Nav.Link>
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link href={`?${queryString.stringify({
                                    tab: "users"
                                })}`} className={"text-decoration-none"}>
                                    <Nav.Link as={"div"} className={clsx(styles["admin-nav-link"], {
                                        [styles["active"]]: query.get("tab") === "users"
                                    })}>
                                        Пользователи
                                    </Nav.Link>
                                </Link>
                            </Nav.Item>
                        </Nav>
                        <div className={styles["tab-list-footer"]}></div>
                    </div>
                </Col>
                <Col className={"d-flex flex-column px-0 h-100"}>
                    {query.get("tab") ? <div className={styles["admin-content"]}>
                        {{
                            "dishes": <DishListComponent setError={setError}/>,
                            "categories": <CategoryListComponent setError={setError}/>,
                            "users": <UserListComponent setError={setError}/>
                        }[query.get("tab")]}
                    </div> : <div className={"d-flex justify-content-center align-items-center h-100"}>
                        <div className={"text-white fs-4"}>Выберите вкладку для просмотра</div>
                    </div>}
                </Col>
            </Row> : <div className={"d-flex justify-content-center align-items-center h-100"}>
                <div className={"text-white fs-4"}>У вас недостаточно привелегий просматривать эту страницу</div>
            </div>}
        </PageComponent>
    </ErrorHandlerComponent>;
}