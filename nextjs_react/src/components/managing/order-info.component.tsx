import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Accordion, Button, Card, Form} from "react-bootstrap";
import {useSearchParams} from "next/navigation";

export function OrderInfoComponent({
                                       setError, auth, order,
                                       statusPreparing, statusReady, statusFinished, statusNotPaid,
                                       editOrder
                                   }: any) {
    let [customer, setCustomer] = useState<any>();
    let [address, setAddress] = useState<any>();
    let query = useSearchParams();
    const loadCustomer = async () => {
        try {
            let customerData = await ApiManager.get(`/api/users/${order.customer}`);
            if (customerData)
                setCustomer(customerData);
        } catch (error: any) {
            setError(error);
        }
    }
    const loadAddress = async () => {
        try {
            let addressData = await ApiManager.get(`/api/addresses/${order.address}`);
            if (addressData)
                setAddress(addressData);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        if (order) {
            loadCustomer();
            loadAddress();
        }
    }, [order]);
    return <Card>
        <Card.Header>
            <Card.Title className={"fw-semibold"}>
                Дата заказа: {new Date(Date.parse(order.orderDate)).toLocaleString()}
            </Card.Title>
            <Card.Text>
                Указанное время: {new Date(Date.parse(order.specifiedDate)).toLocaleString()}
            </Card.Text>
            {query.get("tab") === "finished" ? <Card.Text>
                Время доставки: {new Date(Date.parse(order.deliveryDate)).toLocaleString()}
            </Card.Text> : null}
        </Card.Header>
        <Card.Body>
            <Card.Text className={"col fs-5 fw-semibold"}>
                Итоговая стоимость: {order.price} р.
            </Card.Text>
            <Accordion>
                <Accordion.Item eventKey={"0"}>
                    <Accordion.Header>Адрес заказчика</Accordion.Header>
                    <Accordion.Body>
                        {customer ? <Form.Group>
                            <Form.Label>
                                Заказчик: {customer.name} {customer.phone ? `(${customer.phone})` : null}
                            </Form.Label>
                        </Form.Group> : null}
                        {address ? <>
                            <Form.Group>
                                <Form.Label>
                                    Страна: {address.country}
                                </Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Населенный пункт: {address.locality}
                                </Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Улица: {address.street}
                                </Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Дом: {address.house}
                                </Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Квартира: {address.apartment}
                                </Form.Label>
                            </Form.Group>
                        </> : null}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Card.Body>
        <Card.Footer>
            {query.get("tab") === "awaiting" ? <div className={"d-flex justify-content-end w-100"}>
                <Button variant={"primary"} size={"sm"} onClick={() => editOrder({
                    status: statusPreparing.id,
                    manager: auth.id
                })}>
                    Принять
                </Button>
            </div> : null}
            {query.get("tab") === "preparing" ? <div className={"d-flex justify-content-end w-100"}>
                <Button variant={"primary"} size={"sm"} onClick={() => editOrder({
                    status: statusReady.id,
                })}>
                    Готов
                </Button>
            </div> : null}
            {query.get("tab") === "ready" ? <div className={"d-flex justify-content-end w-100"}>
                <Button variant={"success"} size={"sm"} className={"me-3"} onClick={() => editOrder({
                    status: statusFinished.id
                })}>
                    Доставлен
                </Button>
                <Button variant={"warning"} size={"sm"} className={"ms-3"} onClick={() => editOrder({
                    status: statusNotPaid.id
                })}>
                    Не оплачен
                </Button>
            </div> : null}
        </Card.Footer>
    </Card>;
}