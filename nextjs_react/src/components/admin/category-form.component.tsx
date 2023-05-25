import {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {BadRequestError} from "@/errors/bad-request.error";

export function CategoryFormComponent({setError, category, addCategory, updateCategory, onClose}: any) {
    let [name, setName] = useState("");
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    useEffect(() => {
        if (category) {
            setName(category.name ?? "");
            setValidated(false);
            setFeedback(null);
        }
    }, [category]);
    return <Modal show={!!category} onHide={onClose} backdrop={"static"} keyboard={false} centered={true}>
        {category ? <Form validated={validated}>
            <Modal.Header closeButton={true}>
                <Modal.Title className={"fs-4"}>
                    {category.name ?? "Новая категория"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label htmlFor={"categoryName"} className={"fs-5"}>Название</Form.Label>
                    <Form.Control type={"text"} name={"name"} required
                                  value={name}
                                  onChange={(e: any) => setName(e.target.value)}
                                  id={"categoryName"}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                {feedback ? <div className={"w-100 text-danger fw-bold fst-italic"}>
                    {feedback}
                </div> : null}
                {category.id ? <Button variant={"primary"} className={"w-100"}
                                       onClick={(e: any) => {
                                           (async () => {
                                               if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                                   try {
                                                       await updateCategory({name});
                                                   } catch (error: any) {
                                                       if (error instanceof BadRequestError) {
                                                           console.error(error);
                                                           setFeedback("Неверно введены данные!");
                                                       } else setError(error);
                                                   }
                                               } else setValidated(true);
                                           })();
                                       }}>
                    Изменить
                </Button> : <Button variant={"primary"} className={"w-100"}
                                    onClick={(e: any) => {
                                        (async () => {
                                            if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                                try {
                                                    await addCategory({name});
                                                } catch (error: any) {
                                                    if (error instanceof BadRequestError) {
                                                        console.error(error);
                                                        setFeedback("Неверно введены данные!");
                                                    } else setError(error);
                                                }
                                            } else setValidated(true);
                                        })();
                                    }}>
                    Добавить
                </Button>}
            </Modal.Footer>
        </Form> : null}
    </Modal>;
}