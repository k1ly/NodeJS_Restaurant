import styles from "@/styles/home.module.sass";
import clsx from "classnames";
import {Card} from "react-bootstrap";

const getRandomColor = () => {
    return Array.from(Array(6).keys()).reduce((previousValue) =>
        previousValue + "0123456789ABCDEF"[Math.floor(Math.random() * 16)], "#");
}

export function ReviewInfoComponent({review}: any) {
    return <Card key={review.id}>
        <Card.Header className={"d-flex justify-content-start p-1 bg-light rounded-top"}>
            <Card.Title className={styles["review-user"]}>
                <span className={styles["review-user-thumbnail"]} style={{color: getRandomColor()}}></span>
                {review.user}
            </Card.Title>
            <div className={"mx-2"}>{Array.from(Array(5).keys()).map(i =>
                <span key={i} className={clsx(styles["star"], {
                    [styles["active"]]: i < review.grade
                })}>★</span>)}</div>
            <div className={"text-secondary"}>{new Date(Date.parse(review.date)).toLocaleString()}</div>
        </Card.Header>
        <Card.Body>
            <Card.Text>{review.comment}</Card.Text>
        </Card.Body>
    </Card>;
}