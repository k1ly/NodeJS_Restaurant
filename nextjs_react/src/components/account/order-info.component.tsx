import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Accordion, Button, Card, Form} from "react-bootstrap";
import {useSearchParams} from "next/navigation";

export function OrderInfoComponent({setError, order, cancelOrder}: any) {
    let [address, setAddress] = useState<any>();
    let query = useSearchParams();
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
        if (order)
            loadAddress();
    }, []);
    return <Card>
        <Card.Header>
            <Card.Title className={"fw-semibold"}>
                Дата заказа: {new Date(Date.parse(order.orderDate)).toLocaleString()}
            </Card.Title>
            <Card.Text>
                Указанное время: {new Date(Date.parse(order.specifiedDate)).toLocaleString()}
            </Card.Text>
        </Card.Header>
        <Card.Body>
            <Card.Text className={"col fs-5 fw-semibold"}>
                Итоговая стоимость: {order.price} р.
            </Card.Text>
            <Accordion>
                <Accordion.Item eventKey={"0"}>
                    <Accordion.Header>Адрес</Accordion.Header>
                    <Accordion.Body>
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
                <Button variant={"outline-danger"} size={"sm"}
                        onClick={() => cancelOrder()}>
                    Отменить заказ
                </Button>
            </div> : null}
        </Card.Footer>
    </Card>;
}