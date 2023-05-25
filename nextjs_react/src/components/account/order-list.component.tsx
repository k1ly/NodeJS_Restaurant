import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {OrderInfoComponent} from "@/components/account/order-info.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import clsx from "classnames";
import styles from "@/styles/account.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useRouter, useSearchParams} from "next/navigation";
import queryString from "query-string";
import {Button, Col, Nav, Row, Table, Toast} from "react-bootstrap";
import Link from "next/link";

const statuses: any = {
    "awaiting": "AWAITING",
    "preparing": "PREPARING",
    "ready": "READY",
    "not-paid": "NOT_PAID",
    "finished": "FINISHED"
}

export function OrderListComponent({setError, auth}: any) {
    let [orders, setOrders] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({sort: "orderDate", order: "asc"});
    let [status, setStatus] = useState<any>();
    let [alertPrompt, setAlertPrompt] = useState(false);
    let query = useSearchParams();
    let router = useRouter();
    const loadOrders = async () => {
        try {
            let ordersData = await ApiManager.get("/api/orders", {
                status: status?.id,
                customer: auth?.id,
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
        } catch (error: any) {
            setError(error);
        }
    }
    const cancelOrder = async (order: any) => {
        try {
            await ApiManager.delete(`/api/orders/${order.id}`);
            setAlertPrompt(true);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        if (query.get("tab")?.toString().match(/^(awaiting|preparing|ready|not-paid|finished)$/))
            loadStatus();
        else router.push(`?${queryString.stringify(({
            tab: "awaiting"
        }))}`);
    }, [query]);
    useEffect(() => {
        if (status)
            loadOrders();
    }, [status]);
    return <Row className={"mx-0 w-100 h-100"}>
        <div className={styles["alert"]}>
            <Toast onClose={() => {
                setAlertPrompt(false);
                router.push("/");
            }} show={alertPrompt} delay={3000} autohide={true}>
                <Toast.Header closeButton={false}>
                    <div className={"w-100 fs-5 text-center"}>Заказы</div>
                </Toast.Header>
                <Toast.Body>
                    <div className={"text-center"}>Заказ отменен!</div>
                    <div className={"d-flex justify-content-center w-100"}>
                        <Button variant={"primary"} size={"sm"} onClick={() => {
                            setAlertPrompt(false);
                            router.push("/");
                        }}>ОК</Button>
                    </div>
                </Toast.Body>
            </Toast>
        </div>
        <Col lg={3}>
            <div className={styles["status-list"]}>
                <Nav className={"flex-column"}>
                    <Nav.Item>
                        <Link href={`?${queryString.stringify({
                            tab: "awaiting"
                        })}`} className={"text-decoration-none"}>
                            <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                [styles["active"]]: query.get("tab") === "awaiting"
                            })}>
                                В ожидании
                            </Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href={`?${queryString.stringify({
                            tab: "preparing"
                        })}`} className={"text-decoration-none"}>
                            <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                                [styles["active"]]: query.get("tab") === "preparing"
                            })}>
                                Готовятся
                            </Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Link href={`?${queryString.stringify({
                        tab: "ready"
                    })}`} className={"text-decoration-none"}>
                        <Nav.Link as={"div"} className={clsx(styles["order-nav-link"], {
                            [styles["active"]]: query.get("tab") === "ready"
                        })}>
                            Готовы
                        </Nav.Link>
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
                        })}>
                            Доставлены
                        </Nav.Link>
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
                                        <OrderInfoComponent setError={setError}
                                                            order={order}
                                                            cancelOrder={() => cancelOrder(order)}/>
                                    </td>
                                </tr>)}
                            </tbody>
                        </Table>
                    </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                        <div className={"text-white fs-3"}>История заказов пока пуста</div>
                    </div>}
                </> : <SpinnerComponent variant={"light"} size={"lg"}/>}
            </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                <div className={"text-white fs-4"}>Выберите статус заказов для просмотра</div>
            </div>}
        </Col>
    </Row>;
}