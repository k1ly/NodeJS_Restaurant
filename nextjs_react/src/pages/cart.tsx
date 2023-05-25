import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {AuthManager} from "@/util/auth.manager";
import {PageComponent} from "@/components/page/page.component";
import {OrderFormComponent} from "@/components/cart/order-form.component";
import {OrderItemFormComponent} from "@/components/cart/order-item-form.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import "bootstrap/dist/css/bootstrap.min.css";
import {useRouter} from "next/navigation";
import {Button, Stack, Toast} from "react-bootstrap";
import Link from "next/link";
import styles from "@/styles/cart.module.sass";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function Cart() {
    let [error, setError] = useState<Error>();
    let [orderItems, setOrderItems] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({});
    let [auth, setAuth] = useState<any>();
    let [order, setOrder] = useState<any>();
    let [confirm, setConfirm] = useState(false);
    let [alertPrompt, setAlertPrompt] = useState<string>();
    let [confirmPrompt, setConfirmPrompt] = useState(false);
    let router = useRouter();
    const loadOrder = async () => {
        if (auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/)) {
            try {
                let orderData = await ApiManager.get(`/api/orders/${auth.order}`)
                if (orderData)
                    setOrder(orderData);
            } catch (error: any) {
                setError(error);
            }
        }
    }
    const loadOrderItems = async () => {
        try {
            let orderItemsData = await ApiManager.get(auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ? "/api/order-items" : "/cart", {
                order: auth?.order,
                page: pageable.page
            });
            if (orderItemsData) {
                setOrderItems(orderItemsData.content);
                setTotal(orderItemsData.total);
                setPageable(orderItemsData.pageable);
                loadOrder();
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const updateOrderItem = async (id: number, orderItemDto: any) => {
        try {
            if (orderItemDto.quantity > 0) {
                await ApiManager.put(auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ?
                    `/api/order-items/${id}` : `/cart/${id}`, orderItemDto);
                loadOrderItems();
            } else {
                await ApiManager.delete(auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ?
                    `/api/order-items/${id}` : `/cart/${id}`);
                loadOrderItems();
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const confirmOrder = async (orderDto: any) => {
        await ApiManager.put(`/api/orders/${auth.order}`, orderDto);
        setConfirmPrompt(true);
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
        if (auth)
            loadOrderItems();
    }, [auth]);
    return <ErrorHandlerComponent error={error}>
        <PageComponent setError={setError} auth={auth}>
            <div className={styles["alert"]}>
                <Toast onClose={() => {
                    setAlertPrompt(null);
                }} show={!!alertPrompt} delay={3000}>
                    <Toast.Header closeButton={false}>
                        <div className={"w-100 fs-5 text-center"}>Оформление заказа</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>{alertPrompt}</div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <Button variant={"primary"} size={"sm"} onClick={() => {
                                setAlertPrompt(null);
                            }}>ОК</Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <div className={styles["alert"]}>
                <Toast onClose={() => {
                    setConfirmPrompt(false);
                    router.push("/");
                }} show={confirmPrompt} delay={3000} autohide={true}>
                    <Toast.Header closeButton={false}>
                        <div className={"w-100 fs-5 text-center"}>Оформление заказа</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>Заказ подтвержден!</div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <Button variant={"primary"} size={"sm"} onClick={() => {
                                setConfirmPrompt(false);
                                router.push("/");
                            }}>ОК</Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <div className={"d-flex flex-column h-100"}>
                <div className={"m-3 border-3 border-bottom text-center text-white fs-2"}>
                    Корзина
                </div>
                {orderItems ? <>
                    {total > 0 ? <>
                        <OrderFormComponent setError={setError}
                                            confirm={confirm} order={order}
                                            confirmOrder={confirmOrder}
                                            onClose={() => setConfirm(false)}/>
                        <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                            pageable.page = page;
                            loadOrderItems();
                        }}/>
                        <div className={"d-flex justify-content-center flex-fill"}>
                            <div className={"w-75"}>
                                <Stack>
                                    {orderItems.map((orderItem: any) =>
                                        <OrderItemFormComponent key={orderItem.id ?? orderItem.dish} setError={setError}
                                                                orderItem={orderItem}
                                                                updateOrderItem={(orderItemDto: any) => updateOrderItem(auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ?
                                                                    orderItem.id : orderItem.dish, orderItemDto)}/>)}
                                </Stack>
                            </div>
                        </div>
                        <div className={"d-flex justify-content-center m-4"}>
                            <Button variant={"success"} size={"lg"} className={"w-50"}
                                    onClick={() => {
                                        if (auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/)) {
                                            if (auth.blocked)
                                                setAlertPrompt("Вы не сможете оформить заказ, так как ваш аккаунт заблокирован");
                                            else setConfirm(true);
                                        } else setAlertPrompt("Вы не сможете оформить заказ пока не зарегистрируетесь");
                                    }}>
                                Оформить заказ
                            </Button>
                        </div>
                    </> : <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                        <div className={"text-center"}>
                            <div className={"fs-3 text-white"}>В корзине пока пусто</div>
                            <Link href={"/menu?category=1"}>
                                <Button variant={"danger"} size={"lg"} className={"m-4 rounded-pill"}>
                                    Посмотреть меню
                                </Button>
                            </Link>
                        </div>
                    </div>}
                </> : <SpinnerComponent variant={"light"} size={"lg"}/>}
            </div>
        </PageComponent>
    </ErrorHandlerComponent>;
}