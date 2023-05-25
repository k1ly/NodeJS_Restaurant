import {useState} from "react";
import clsx from "classnames";
import styles from "@/styles/home.module.sass";
import {Button, Form} from "react-bootstrap";
import {BadRequestError} from "@/errors/bad-request.error";

export function ReviewFormComponent({setError, auth, addReview}: any) {
    let [review, setReview] = useState(false);
    let [temp, setTemp] = useState(0);
    let [grade, setGrade] = useState(0);
    let [comment, setComment] = useState("");
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    return auth?.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ? <div className={"my-5"}>
        {review ? <Form validated={validated} className={"mx-5 rounded bg-light"}>
            <div className={"m-2 fs-4"}>
                {Array.from(Array(5).keys())
                    .map(i => <span key={i}
                                    className={clsx(styles["star"], {
                                        [styles["active"]]: temp > i || grade > i
                                    })}
                                    onClick={() => {
                                        setTemp(i + 1);
                                        setGrade(i + 1);
                                    }}
                                    onMouseEnter={() => setTemp(i + 1)}
                                    onMouseLeave={() => setTemp(grade)}>★</span>)}
                <Form.Control type={"hidden"} name={"grade"} required
                              value={grade} min={1} max={5}/>
            </div>
            <div className={"d-flex justify-content-center px-4"}>
                <Form.Control as={"textarea"} size={"lg"} name={"comment"} required
                              value={comment} onChange={(e: any) => setComment(e.target.value)}/>
            </div>
            <div className={"d-flex justify-content-end py-3"}>
                {feedback ? <div className={"text-danger fw-bold fst-italic"}>
                    {feedback}
                </div> : null}
                <Button variant={"success"} disabled={grade === 0 || comment.length === 0} className={"mx-3"}
                        onClick={(e: any) => {
                            (async () => {
                                if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                    try {
                                        await addReview({grade, comment, user: auth.id});
                                        setReview(false);
                                        setGrade(0);
                                        setComment("");
                                        setValidated(false);
                                        setFeedback(null);
                                    } catch (error: any) {
                                        if (error instanceof BadRequestError) {
                                            console.error(error);
                                            setFeedback("Неверно введены данные!");
                                        } else setError(error);
                                    }
                                } else setValidated(true);
                            })();
                        }}>
                    Отправить
                </Button>
                <Button variant={"outline-dark"} className={"mx-3"}
                        onClick={() => {
                            setReview(false);
                            setGrade(0);
                            setComment("");
                            setValidated(false);
                            setFeedback(null);
                        }}>
                    Отменить
                </Button>
            </div>
        </Form> : <div className={"mx-3"}>
            <Button variant={"danger"} onClick={() => setReview(true)}>
                Оставить отзыв
            </Button>
        </div>}
    </div> : null;
}