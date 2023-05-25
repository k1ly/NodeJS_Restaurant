import {useState} from "react";
import {Button, Card, Image} from "react-bootstrap";
import styles from "@/styles/menu.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import clsx from "classnames";
import {ConfigManager} from "@/util/config.manager";

export function DishInfoComponent({dish, addOrderItem}: any) {
    let [description, setDescription] = useState(false);
    return <Card className={"my-1"}>
        <div className={"d-flex h-100"}>
            <div className={styles["dish-image"]}>
                <Image src={`${ConfigManager.get("API_URL")}/${dish.imageUrl}`} alt={""}
                       className={"position-relative w-100 h-100 rounded"}/>
                {dish.discount && dish.discount > 0 ?
                    <div className={styles["dish-discount"]}>
                        <svg width="50" height="50" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"
                             className={"mt-1 ms-1"}>
                            <path fill="#e80202bf" d="M0 1 1 0H0z"/>
                        </svg>
                        <span className={styles["dish-discount"]}>
                            <div className={styles["dish-discount-text"]}>
                                -{dish.discount}%
                            </div>
                        </span>
                    </div> : null}
            </div>
            <div className={"w-100 pt-1"}>
                <Card.Header>
                    <Card.Title className={"fs-5"}>{dish.name}</Card.Title>
                </Card.Header>
                <Card.Body className={"py-md-4"}>
                    <Card.Text className={clsx({["text-truncate"]: !description})}
                               onClick={() => setDescription(!description)}>
                        {dish.description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div className={"d-flex justify-content-between"}>
                        <div className={"d-flex justify-content-between w-25"}>
                            <div className={"border-2 border-end pe-3"}>{dish.weight} г.</div>
                            <div className={"d-flex justify-content-end fs-5"}>
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
                        </div>
                        <div>
                            <Button variant={"outline-primary"} size={"sm"}
                                    onClick={() => addOrderItem()}>
                                Добавить в корзину
                            </Button>
                        </div>
                    </div>
                </Card.Footer>
            </div>
        </div>
    </Card>;
}