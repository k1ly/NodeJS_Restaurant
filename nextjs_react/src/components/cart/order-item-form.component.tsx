import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Card, CloseButton, Form, Image, InputGroup} from "react-bootstrap";
import styles from "@/styles/cart.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {ConfigManager} from "@/util/config.manager";

export function OrderItemFormComponent({setError, orderItem, updateOrderItem}: any) {
    let [quantity, setQuantity] = useState<number>();
    let [dish, setDish] = useState<any>();
    const loadDish = async () => {
        try {
            let dishData = await ApiManager.get(`/api/dishes/${orderItem.dish}`);
            if (dishData)
                setDish(dishData);
        } catch (error: any) {
            setError(error);
        }
    }
    const handleQuantity = (quantity: number) => {
        if (Number.isInteger(quantity)) {
            if (quantity !== orderItem.quantity) {
                updateOrderItem({
                    quantity
                });
            }
        } else setQuantity(orderItem.quantity);
    }
    useEffect(() => {
        loadDish();
    }, []);
    useEffect(() => {
        setQuantity(orderItem.quantity);
    }, [orderItem]);
    return dish ? <Card className={"my-1"}>
        <div className={"d-flex"}>
            <div className={styles["dish-image"]}>
                <Image src={`${ConfigManager.get("API_URL")}/${dish.imageUrl}`} alt={""}
                       className={"position-relative w-100 h-100 rounded"}/>
            </div>
            <div className={"w-100 pt-1"}>
                <Card.Header>
                    <Card.Title className={"fs-5 fw-semibold"}>{dish.name}</Card.Title>
                </Card.Header>
                <Card.Body className={"py-md-4"}>
                    <div className={"fs-5 ps-2"}>
                        {dish.discount > 0 ? <>
                            <span className={"me-2 text-decoration-line-through text-secondary"}>
                                {dish.price}
                            </span>
                            <span className={"fw-semibold"}>
                                {(dish.price * (100 - dish.discount) / 100).toFixed(2)} р.
                            </span>
                        </> : <span className={"fw-semibold"}>
                            {dish.price} р.
                        </span>}
                    </div>
                </Card.Body>
                <Card.Footer>
                    <InputGroup className={styles["order-item-quantity"]}>
                        <CloseButton className={styles["order-item-minus"]}
                                     onClick={() => handleQuantity(quantity - 1)}></CloseButton>
                        <Form.Control type={"number"} placeholder={"Количество"}
                                      value={quantity?.toString()}
                                      className={"fs-5"}
                                      onChange={(e: any) => handleQuantity(Number(e.target.value))}/>
                        <CloseButton className={styles["order-item-plus"]}
                                     onClick={() => handleQuantity(quantity + 1)}></CloseButton>
                        <CloseButton className={"py-3 border-start border-secondary"}
                                     onClick={() => handleQuantity(0)}></CloseButton>
                    </InputGroup>
                </Card.Footer>
            </div>
        </div>
    </Card> : null;
}