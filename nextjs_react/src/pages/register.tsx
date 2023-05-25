import {createRef, useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {AuthManager} from "@/util/auth.manager";
import {Button, Card, Collapse, Form, InputGroup, Toast} from "react-bootstrap";
import clsx from "classnames";
import styles from "@/styles/register.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {BadRequestError} from "@/errors/bad-request.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";
import {ConflictError} from "@/errors/conflict.error";

export default function Register() {
    let [error, setError] = useState<Error>();
    let [login, setLogin] = useState("");
    let [password, setPassword] = useState("");
    let [showPassword, setShowPassword] = useState(false);
    let [passwordCheck, setPasswordCheck] = useState(false);
    let [matchingPassword, setMatchingPassword] = useState("");
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [phone, setPhone] = useState("");
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    let [alertPrompt, setAlertPrompt] = useState(false);
    let [offset, setOffset] = useState<any>();
    let register = createRef<HTMLDivElement>();
    let router = useRouter();
    useEffect(() => {
        if (register.current)
            setOffset({left: register.current.offsetLeft + register.current.clientWidth + 50});
    }, []);
    return <ErrorHandlerComponent error={error}>
        <div className={styles["register-container"]}>
            <div className={styles["alert"]}>
                <Toast onClose={() => {
                    setAlertPrompt(false);
                }} show={alertPrompt} delay={3000}>
                    <Toast.Header closeButton={false}>
                        <div className={"w-100 fs-5 text-center"}>Регистрация</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>Регистрация выполнена успешно!</div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <Button variant={"primary"} size={"sm"} onClick={() => {
                                setAlertPrompt(false);
                                router.push("/");
                            }}>ОК</Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <div ref={register} className={styles["register"]}>
                <div className={"text-center fs-3 fw-semibold"}>Регистрация</div>
                <Form validated={validated}>
                    <Form.Floating className={"my-1"}>
                        <Form.Control size={"lg"} type={"text"} name={"login"} required
                                      placeholder={"Введите логин"} value={login} autoComplete={"off"}
                                      pattern={"^[A-Za-z]\\w*$"}
                                      title={"Должен начинаться с латинского символа и содержать от 4 до 20 символов"}
                                      id={"login"}
                                      onChange={(e: any) => setLogin(e.target.value)}/>
                        <Form.Label htmlFor={"login"} className={"fs-5"}>Логин</Form.Label>
                        <div className={"invalid-feedback"}>Неверно указан логин</div>
                    </Form.Floating>
                    <InputGroup className={"my-1"}>
                        <Form.Floating>
                            <Form.Control size={"lg"} type={showPassword ? "text" : "password"} name={"password"}
                                          required
                                          placeholder={"Введите пароль"} value={password}
                                          pattern={"^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$"}
                                          title={"Должен содержать не менее одной цифры и одной прописной и строчной буквы, а также от 8 до 16 символов"}
                                          id={"password"}
                                          onFocus={() => setPasswordCheck(true)}
                                          onBlur={() => setPasswordCheck(false)}
                                          onChange={(e: any) => setPassword(e.target.value)}/>
                            <Form.Label htmlFor={"password"} className={"fs-5"}>Пароль</Form.Label>
                        </Form.Floating>
                        <Button variant={"outline-secondary"} className={styles["show-password"]}
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}>
                            👁
                        </Button>
                    </InputGroup>
                    <div className={"d-flex align-items-center position-absolute top-0 h-100"} style={offset}>
                        <Collapse in={passwordCheck} dimension={"width"}>
                            <Card>
                                <div className={styles["password-check"]}>
                                    <div className={"p-4 fw-semibold"}>Пароль должен содержать:</div>
                                    <div className={clsx(styles["password-constraint"], {
                                        [styles["valid"]]: password.match("[a-z]")
                                    })}>
                                        <b>Строчную</b> букву
                                    </div>
                                    <div className={clsx(styles["password-constraint"], {
                                        [styles["valid"]]: password.match("[A-Z]")
                                    })}>
                                        <b>Заглавную</b> букву
                                    </div>
                                    <div className={clsx(styles["password-constraint"], {
                                        [styles["valid"]]: password.match("[0-9]")
                                    })}>
                                        <b>Число</b>
                                    </div>
                                    <div className={clsx(styles["password-constraint"], {
                                        [styles["valid"]]: password.length >= 8
                                    })}>
                                        Минимум <b>8 символов</b>
                                    </div>
                                </div>
                            </Card>
                        </Collapse>
                    </div>
                    <Form.Floating className={"my-1"}>
                        <Form.Control size={"lg"} type={showPassword ? "text" : "password"} name={"matchingPassword"}
                                      required
                                      placeholder={"Повторите пароль"}
                                      value={matchingPassword}
                                      pattern={`^${password}$`}
                                      id={"matchingPassword"}
                                      onChange={(e: any) => setMatchingPassword(e.target.value)}/>
                        <Form.Label htmlFor={"matchingPassword"} className={"fs-5"}>Повторите пароль</Form.Label>
                        <div className={"invalid-feedback"}>Пароли должны совпадать</div>
                    </Form.Floating>
                    <Form.Floating className={"my-1"}>
                        <Form.Control size={"lg"} type={"text"} name={"name"} placeholder={"Введите имя"} required
                                      value={name} autoComplete={"off"}
                                      pattern={"^[A-Za-z]+([. \"-][A-Za-z]+)*$"}
                                      title={"Не должно содержать цифр или специальных знаков"}
                                      id={"name"}
                                      onChange={(e: any) => setName(e.target.value)}/>
                        <Form.Label htmlFor={"name"} className={"fs-5"}>Имя</Form.Label>
                        <div className={"invalid-feedback"}>Неверно указано имя</div>
                    </Form.Floating>
                    <Form.Floating className={"my-1"}>
                        <Form.Control size={"lg"} type={"email"} name={"email"} placeholder={"Введите свою почту"}
                                      value={email}
                                      title={"Должен содержать символ @, а также не менее 8 символов"}
                                      id={"email"}
                                      onChange={(e: any) => setEmail(e.target.value)}/>
                        <Form.Label htmlFor={"email"} className={"fs-5"}>Почта</Form.Label>
                        <div className={"invalid-feedback"}>Неверно указана почта</div>
                    </Form.Floating>
                    <Form.Floating className={"my-1"}>
                        <Form.Control size={"lg"} type={"tel"} name={"phone"} placeholder={"Введите свой телефон"}
                                      value={phone}
                                      pattern={"^((\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[- ]?\\d{3,4}[- ]?\\d{4})?$"}
                                      title={"Должен быть введен номер телефона с кодом страны"}
                                      id={"phone"}
                                      onChange={(e: any) => setPhone(e.target.value)}/>
                        <Form.Label htmlFor={"phone"} className={"fs-5"}>Телефон</Form.Label>
                        <div className={"invalid-feedback"}>Неверно указан телефон</div>
                    </Form.Floating>
                    <div>
                        {feedback ? <div className={"text-danger fw-bold fst-italic"}>
                            {feedback}
                        </div> : null}
                        <Button variant={"success"} className={"w-100 fs-5"} onClick={(e: any) => {
                            (async () => {
                                if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                    try {
                                        await ApiManager.post("/auth/register", {
                                            login,
                                            password,
                                            matchingPassword,
                                            name: name?.trim().length > 0 ? name : undefined,
                                            email: email?.trim().length > 0 ? email : undefined
                                        });
                                        await AuthManager.login(login, password)
                                        setAlertPrompt(true)
                                    } catch (error: any) {
                                        if (error instanceof BadRequestError) {
                                            console.error(error);
                                            setFeedback("Неверно введены данные для регистрации!");
                                        } else if (error instanceof ConflictError) {
                                            console.error(error);
                                            setFeedback("Такой пользователь уже существует!");
                                        } else setError(error);
                                    }
                                } else setValidated(true);
                            })();
                        }}>
                            Зарегистрироваться
                        </Button>
                    </div>
                </Form>
                <div className={"d-flex justify-content-between mt-2"}>
                    <Link href={"/"}>
                        <Button variant={"outline-dark"}>Назад</Button>
                    </Link>
                    <div className={"fs-5 fst-italic"}>
                        Уже есть аккаунт? <Link href={"/login"}>Войти</Link>
                    </div>
                </div>
            </div>
        </div>
    </ErrorHandlerComponent>;
}