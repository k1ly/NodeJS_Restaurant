import {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Card, Form, InputGroup, Table} from "react-bootstrap";
import clsx from "classnames";
import {BadRequestError} from "@/errors/bad-request.error";

export function ProfileComponent({setError, auth, updateUser}: any) {
    let [name, setName] = useState<string>(auth.name);
    let [email, setEmail] = useState<string>(auth.email ?? "");
    let [phone, setPhone] = useState<string>(auth.phone ?? "");
    let [editName, setEditName] = useState(false);
    let [editEmail, setEditEmail] = useState(false);
    let [editPhone, setEditPhone] = useState(false);
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    return <div className={"d-flex justify-content-center align-items-center w-100 h-100"}>
        <Card className={"mt-4 w-50 shadow"}>
            <Card.Body>
                <Form validated={validated}>
                    <Table striped={true}>
                        <tbody>
                        <tr>
                            <td>
                                <Form.Label htmlFor={"login"} className={"fs-5"}>Логин</Form.Label>
                            </td>
                            <td>
                                <Form.Control plaintext={true} type={"text"} name={"login"}
                                              value={auth.login} disabled={true}
                                              id={"login"} className={"ps-2"}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Form.Label htmlFor={"name"} className={"fs-5"}>Имя</Form.Label>
                            </td>
                            <td>
                                <InputGroup>
                                    <Form.Control type={"text"} name={"name"} required
                                                  value={name}
                                                  minLength={4}
                                                  maxLength={40}
                                                  pattern={"^[a-zA-Z]+([\\. '-][a-zA-Z]+)*$"}
                                                  title={"Не должно содержать цифр или специальных знаков"}
                                                  onChange={(e: any) => setName(e.target.value)}
                                                  id={"name"}
                                                  disabled={!editName}
                                                  className={clsx({
                                                      ["ps-2"]: !editName
                                                  })}/>
                                    <Button variant={"outline-secondary"} onClick={() => setEditName(!editName)}>
                                        Изменить имя
                                    </Button>
                                </InputGroup>
                                <div className={"invalid-feedback"}>Неверно указано имя</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Form.Label htmlFor={"email"} className={"fs-5"}>Почта</Form.Label>
                            </td>
                            <td>
                                <InputGroup>
                                    <Form.Control type={"email"} name={"email"}
                                                  value={email}
                                                  title={"Должен содержать символ @, а также не менее 8 символов"}
                                                  onChange={(e: any) => setEmail(e.target.value)}
                                                  id={"email"}
                                                  disabled={!editEmail}
                                                  className={clsx({
                                                      ["ps-2"]: !editEmail
                                                  })}/>
                                    <Button variant={"outline-secondary"} onClick={() => setEditEmail(!editEmail)}>
                                        Изменить почту
                                    </Button>
                                </InputGroup>
                                <div className={"invalid-feedback"}>Неверно указана почта</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Form.Label htmlFor={"phone"} className={"fs-5"}>Телефон</Form.Label>
                            </td>
                            <td>
                                <InputGroup>
                                    <Form.Control type={"tel"} name={"phone"}
                                                  value={phone}
                                                  pattern={"^((\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[- ]?\\d{3,4}[- ]?\\d{4})?$"}
                                                  title={"Должен быть введен номер телефона с кодом страны"}
                                                  onChange={(e: any) => setPhone(e.target.value)}
                                                  id={"phone"}
                                                  disabled={!editPhone}
                                                  className={clsx({
                                                      ["ps-2"]: !editPhone
                                                  })}/>
                                    <Button variant={"outline-secondary"} onClick={() => setEditPhone(!editPhone)}>
                                        Изменить телефон
                                    </Button>
                                </InputGroup>
                                <div className={"invalid-feedback"}>Неверно указан телефон</div>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                    <div>
                        {feedback ? <div className={"text-danger fw-bold fst-italic"}>
                            {feedback}
                        </div> : null}
                        <Button variant={"secondary"}
                                disabled={(name === "" || name === auth.name)
                                    && (email === "" || email === auth.email)
                                    && (phone === "" || phone === auth.phone)}
                                onClick={(e: any) => {
                                    (async () => {
                                        if ((e.target as HTMLButtonElement).form.checkValidity()) {
                                            try {
                                                await updateUser({name, email, phone});
                                            } catch (error: any) {
                                                if (error instanceof BadRequestError) {
                                                    console.error(error);
                                                    setFeedback("Неверно введены данные!");
                                                } else setError(error);
                                            }
                                        } else setValidated(true);
                                    })();
                                }}>
                            Сохранить изменения
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    </div>;
}