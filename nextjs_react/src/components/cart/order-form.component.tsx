import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Button, Card, Collapse, Form, Modal, Toast} from "react-bootstrap";
import styles from "@/styles/managing.module.sass";
import {BadRequestError} from "@/errors/bad-request.error";

export function OrderFormComponent({setError, confirm, order, confirmOrder, onClose}: any) {
    let [addresses, setAddresses] = useState<any[]>();
    let [country, setCountry] = useState("");
    let [locality, setLocality] = useState("");
    let [street, setStreet] = useState("");
    let [house, setHouse] = useState("");
    let [apartment, setApartment] = useState("");
    let [address, setAddress] = useState(0);
    let [showAddress, setShowAddress] = useState(false);
    let [specifiedDate, setSpecifiedDate] = useState("");
    let [orderValidated, setOrderValidated] = useState(false);
    let [addressValidated, setAddressValidated] = useState(false);
    let [orderFeedback, setOrderFeedback] = useState<string>();
    let [addressFeedback, setAddressFeedback] = useState<string>();
    let [notification, setNotification] = useState<string>();
    let loadAddresses = async () => {
        try {
            let addressesData = await ApiManager.get("/api/addresses", {
                user: order.customer
            });
            if (addressesData)
                setAddresses(addressesData.content);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        if (order)
            loadAddresses();
        else {
            setCountry("");
            setLocality("");
            setStreet("");
            setHouse("");
            setApartment("");
            setAddress(0);
            setShowAddress(false);
            setSpecifiedDate("");
        }
    }, [order]);
    return <>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Новый адрес</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        <Modal show={confirm} onHide={onClose} backdrop={"static"} keyboard={false} centered>
            {order ? <Form validated={orderValidated} className={"my-1"}>
                <Modal.Header closeButton>
                    <Modal.Title className={"fs-4"}>
                        Оформление заказа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addresses ? <div className={"my-2"}>
                        <Form.Label htmlFor={"address"}>Адрес</Form.Label>
                        <Form.Select name={"address"} required
                                     value={address}
                                     onChange={(e: any) => setAddress(Number(e.target.value))}
                                     id={"address"}>
                            <option value={0} disabled={true}>
                                ...
                            </option>
                            {addresses.map((address: any) =>
                                <option key={address.id} value={address.id}>
                                    {address.locality}, {address.country}, {address.street} {address.house} {address.apartment}
                                </option>
                            )}
                        </Form.Select>
                    </div> : null}
                    <div className={"w-100"}>
                        <Button variant={"outline-primary"}
                                onClick={() => setShowAddress(!showAddress)}>
                            {showAddress ? "Скрыть" : "Добавить новый адрес"}
                        </Button>
                        <Collapse in={showAddress}>
                            <Card className={"my-2 px-2"}>
                                <Form validated={addressValidated}>
                                    <Form.Group>
                                        <Form.Label htmlFor={"country"}>
                                            Страна
                                        </Form.Label>
                                        <Form.Control type={"text"} name={"country"} required
                                                      value={country}
                                                      onChange={(e: any) => setCountry(e.target.value)}
                                                      id={"country"}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor={"locality"}>
                                            Населенный пункт
                                        </Form.Label>
                                        <Form.Control type={"text"} name={"locality"} required
                                                      value={locality}
                                                      onChange={(e: any) => setLocality(e.target.value)}
                                                      id={"locality"}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor={"street"}>
                                            Улица
                                        </Form.Label>
                                        <Form.Control type={"text"} name={"street"}
                                                      value={street}
                                                      onChange={(e: any) => setStreet(e.target.value)}
                                                      id={"street"}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor={"house"}>
                                            Дом
                                        </Form.Label>
                                        <Form.Control type={"text"} name={"house"} required
                                                      value={house}
                                                      onChange={(e: any) => setHouse(e.target.value)}
                                                      id={"house"}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor={"apartment"}>
                                            Квартира
                                        </Form.Label>
                                        <Form.Control type={"text"} name={"apartment"}
                                                      value={apartment}
                                                      onChange={(e: any) => setApartment(e.target.value)}
                                                      id={"apartment"}/>
                                    </Form.Group>
                                    <div>
                                        {addressFeedback ? <div className={"text-danger fw-bold fst-italic"}>
                                            {addressFeedback}
                                        </div> : null}
                                        <div className={"d-flex justify-content-center w-100"}>
                                            <Button variant={"primary"} size={"sm"}
                                                    className={"m-1"}
                                                    onClick={(e: any) => {
                                                        (async () => {
                                                            if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                                                try {
                                                                    await ApiManager.post("/api/addresses",
                                                                        {
                                                                            country,
                                                                            locality,
                                                                            street,
                                                                            house,
                                                                            apartment,
                                                                            user: order.customer
                                                                        })
                                                                    setCountry("");
                                                                    setLocality("");
                                                                    setStreet("");
                                                                    setHouse("");
                                                                    setApartment("");
                                                                    setAddress(0);
                                                                    setAddressValidated(false);
                                                                    setAddressFeedback(null);
                                                                    setShowAddress(false);
                                                                    setNotification("Адрес успешно добавлен!");
                                                                    loadAddresses();
                                                                } catch (error: any) {
                                                                    if (error instanceof BadRequestError) {
                                                                        console.error(error);
                                                                        setAddressFeedback("Неверно введены данные!");
                                                                    } else setError(error);
                                                                }
                                                            } else setAddressValidated(true);
                                                        })();
                                                    }}>
                                                Добавить адрес
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </Card>
                        </Collapse>
                    </div>
                    <div>
                        <Form.Label htmlFor={"specifiedDate"} className={"fs-5"}>Время доставки</Form.Label>
                        <Form.Control type={"datetime-local"} name={"specifiedDate"} required
                                      placeholder={"Время доставки"}
                                      min={(() => {
                                          let date = new Date();
                                          date.setMinutes(date.getMinutes() + 30);
                                          return date.toISOString().slice(0, 16);
                                      })()}
                                      max={(() => {
                                          let date = new Date();
                                          date.setDate(date.getDate() + 7);
                                          return date.toISOString().slice(0, 16);
                                      })()}
                                      value={specifiedDate}
                                      title={"Минимальная дата - текущая + пол часа, максимальная - текущая + 7 дней"}
                                      id={"specifiedDate"}
                                      onChange={(e: any) => setSpecifiedDate(e.target.value)}/>
                    </div>
                    <div className={"mt-3 px-3 bg-light fs-4"}>
                        Итоговая сумма: {order.price} р.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {orderFeedback ? <div className={"w-100 text-danger fw-bold fst-italic"}>
                        {orderFeedback}
                    </div> : null}
                    <Button variant={"success"} className={"w-100"}
                            onClick={(e: any) => {
                                (async () => {
                                    if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                        try {
                                            await confirmOrder({
                                                specifiedDate: new Date(specifiedDate),
                                                address
                                            });
                                        } catch (error: any) {
                                            if (error instanceof BadRequestError) {
                                                console.error(error);
                                                setOrderFeedback("Неверно введены данные!");
                                            } else setError(error);
                                        }
                                    } else setOrderValidated(true);
                                })();
                            }}>
                        Подтвердить заказ
                    </Button>
                </Modal.Footer>
            </Form> : null}
        </Modal>
    </>;
}