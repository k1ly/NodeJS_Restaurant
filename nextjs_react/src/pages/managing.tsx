import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {AuthManager} from "@/util/auth.manager";
import {PageComponent} from "@/components/page/page.component";
import {OrderInfoComponent} from "@/components/managing/order-info.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import clsx from "classnames";
import styles from "@/styles/managing.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useRouter, useSearchParams} from "next/navigation";
import {io} from "socket.io-client";
import {ConfigManager} from "@/util/config.manager";
import queryString from "query-string";
import {Col, Nav, Row, Table, Toast} from "react-bootstrap";
import Link from "next/link";
import {ForbiddenError} from "@/errors/forbidden.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

const statuses: any = {
    "awaiting": "AWAITING",
    "preparing": "PREPARING",
    "ready": "READY",
    "not-paid": "NOT_PAID",
    "finished": "FINISHED"
}

let socket = io(ConfigManager.get("API_URL"));

export default function Managing() {
    let [error, setError] = useState<Error>();
    let [orders, setOrders] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({sort: "orderDate", order: "asc"});
    let [status, setStatus] = useState<any>();
    let [statusPreparing, setStatusPreparing] = useState<any>();
    let [statusReady, setStatusReady] = useState<any>();
    let [statusFinished, setStatusFinished] = useState<any>();
    let [statusNotPaid, setStatusNotPaid] = useState<any>();
    let [auth, setAuth] = useState<any>();
    let [notification, setNotification] = useState<string>();
    let query = useSearchParams();
    let router = useRouter();
    const loadOrders = async () => {
        try {
            let ordersData = await ApiManager.get("/api/orders", {
                status: status?.id,
                page: pageable.page,
                sort: `${pageable.sort},${pageable.order}`
            });
            if (ordersData) {
                setOrders(ordersData.content);
                setTotal(ordersData.total);
                setPageable(ordersData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const loadStatus = async () => {
        try {
            let statusData = await ApiManager.get("/api/statuses/find", {
                name: statuses[query.get("tab")]
            });
            if (statusData)
                setStatus(statusData);
            switch (query.get("tab")) {
                case "awaiting":
                    let statusPreparingData = await ApiManager.get("/api/statuses/find", {
                        name: "PREPARING"
                    });
                    if (statusPreparingData)
                        setStatusPreparing(statusPreparingData);
                    break;
                case "preparing":
                    let statusReadyData = await ApiManager.get("/api/statuses/find", {
                        name: "READY"
                    });
                    if (statusReadyData)
                        setStatusReady(statusReadyData);
                    break;
                case "ready":
                    let statusFinishedData = await ApiManager.get("/api/statuses/find", {
                        name: "FINISHED"
                    });
                    if (statusFinishedData)
                        setStatusFinished(statusFinishedData);
                    let statusNotPaidData = await ApiManager.get("/api/statuses/find", {
                        name: "NOT_PAID"
                    });
                    if (statusNotPaidData)
                        setStatusNotPaid(statusNotPaidData);
                    break;
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const editOrder = async (id: number, orderDto: any) => {
        try {
            await ApiManager.patch(`/api/orders/${id}`, orderDto);
            setNotification("Статус заказа обновлен!");
            loadOrders();
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        (async () => {
            try {
                let authData = await AuthManager.authenticate();
                if (authData?.role?.match(/^(MANAGER|ADMIN)$/))
                    setAuth(authData);
                else setError(new ForbiddenError("Manager"));
            } catch (error: any) {
                setError(error);
            }
        })();
    }, []);
    useEffect(() => {
        if (auth && query.get("tab")?.toString().match(/^(awaiting|preparing|ready|not-paid|finished)$/)) {
            loadStatus();
            socket.off("orders");
            socket.on("orders", (status: any) => {
                if (statuses[query.get("tab")] === status)
                    loadStatus();
            });
        } else router.push(`?${queryString.stringify(({
            tab: "awaiting"
        }))}`);
    }, [auth, query]);
    useEffect(() => {
        if (status)
            loadOrders();
    }, [status]);
    return <ErrorHandlerComponent error={error}>
        <PageComponent setError={setError} auth={auth}>
            <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
                   className={styles["notification"]}>
                <Toast.Header>
                    <div className={"me-auto fs-5"}>Управление заказами</div>
                </Toast.Header>
                <Toast.Body>{notification}</Toast.Body>
            </Toast>
            {auth ? <Row className={"mx-0 h-100"}>
                <Col lg={3}>
                    <div className={styles["status-list"]}>
                        <Nav className={"flex-column"}>
                            <Link href={`?${queryString.stringify({
                                tab: "awaiting"
                            })}`} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]: query.get("tab") === "awaiting"
                                })}>
                                    В ожидании
                                </Nav.Link>
                            </Link>
                            <Link href={`?${queryString.stringify({
                                tab: "preparing"
                            })}`} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]: query.get("tab") === "preparing"
                                })}>Готовятся</Nav.Link>
                            </Link>
                            <Link href={`?${queryString.stringify({
                                tab: "ready"
                            })}`} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]: query.get("tab") === "ready"
                                })}>Готовы</Nav.Link>
                            </Link>
                            <Link href={`?${queryString.stringify({
                                tab: "not-paid"
                            })}`} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]: query.get("tab") === "not-paid"
                                })}>Не оплачены</Nav.Link>
                            </Link>
                            <Link href={`?${queryString.stringify({
                                tab: "finished"
                            })}`} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                    [styles["active"]]: query.get("tab") === "finished"
                                })}>Доставлены</Nav.Link>
                            </Link>
                        </Nav>
                        <div className={styles["status-list-footer"]}></div>
                    </div>
                </Col>
                <Col className={"d-flex flex-column pt-4 px-0 h-100"}>
                    {status ? <>
                        {orders ? <>
                            {total > 0 ? <>
                                <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                                    pageable.page = page;
                                    loadOrders();
                                }}/>
                                <Table striped={true} hover={true} className={"flex-fill"}>
                                    <tbody>
                                    {orders.map((order: any) =>
                                        <tr key={order.id}>
                                            <td>
                                                <OrderInfoComponent
                                                    setError={setError} auth={auth}
                                                    order={order}
                                                    statusPreparing={statusPreparing}
                                                    statusReady={statusReady}
                                                    statusFinished={statusFinished}
                                                    statusNotPaid={statusNotPaid}
                                                    editOrder={(orderDto: any) => editOrder(order.id, orderDto)}/>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </Table>
                            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                                <div className={"text-white fs-3"}>Список заказов пуст</div>
                            </div>}
                        </> : <SpinnerComponent variant={"light"} size={"lg"}/>}
                    </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                        <div className={"text-white fs-4"}>Выберите статус заказов для просмотра</div>
                    </div>}
                </Col>
            </Row> : <div className={"d-flex justify-content-center align-items-center h-100"}>
                <div className={"text-white fs-4"}>У вас недостаточно привелегий просматривать эту страницу</div>
            </div>}
        </PageComponent>
    </ErrorHandlerComponent>;
}