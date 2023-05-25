import {useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import styles from "@/styles/login.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useRouter} from "next/navigation";
import {Button, Form, InputGroup} from "react-bootstrap";
import Link from "next/link";
import {BadRequestError} from "@/errors/bad-request.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";
import {UnauthorizedError} from "@/errors/unauthorized.error";

export default function Login() {
    let [error, setError] = useState<Error>();
    let [login, setLogin] = useState("");
    let [password, setPassword] = useState("");
    let [showPassword, setShowPassword] = useState(false);
    let [remember, setRemember] = useState(false);
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    let router = useRouter();
    return <ErrorHandlerComponent error={error}>
        <div className={styles["login-container"]}>
            <div className={styles["login"]}>
                <div className={"text-center fs-3 fw-semibold"}>Вход в систему</div>
                <Form validated={validated}>
                    <Form.Group className={"my-1"}>
                        <Form.Label htmlFor={"login"} className={"fs-5"}>Логин</Form.Label>
                        <Form.Control size={"lg"} type={"text"} name={"login"} required
                                      placeholder={"Введите логин"} value={login} autoComplete={"off"}
                                      minLength={4}
                                      maxLength={20}
                                      pattern={"^[A-Za-z]\\w*$"}
                                      title={"Должен начинаться с латинского символа и содержать от 4 до 20 символов"}
                                      id={"login"}
                                      onChange={(e: any) => setLogin(e.target.value)}/>
                        <div className={"invalid-feedback"}>Неверно указан логин</div>
                    </Form.Group>
                    <Form.Group className={"my-1"}>
                        <Form.Label htmlFor={"password"} className={"fs-5"}>Пароль</Form.Label>
                        <InputGroup>
                            <Form.Control size={"lg"} type={showPassword ? "text" : "password"} name={"password"}
                                          required
                                          placeholder={"Введите пароль"} value={password} autoComplete={"off"}
                                          pattern={"^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$"}
                                          title={"Должен содержать не менее одной цифры и одной прописной и строчной буквы, а также от 8 до 16 символов"}
                                          id={"password"}
                                          onChange={(e: any) => setPassword(e.target.value)}/>
                            <Button variant={"outline-secondary"} className={styles["show-password"]}
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}>
                                👁
                            </Button>
                        </InputGroup>
                        <div className={"invalid-feedback"}>Неверно указан пароль</div>
                    </Form.Group>
                    <Form.Check className={"my-2 pt-2 border-top border-secondary border-2 border-opacity-50"}>
                        <Form.Check.Input type={"checkbox"} name={"remember"}
                                          checked={remember}
                                          id={"remember"}
                                          onChange={(e: any) => setRemember(e.target.checked)}/>
                        <Form.Check.Label htmlFor={"remember"} className={"fs-6"}>
                            Запомнить меня
                        </Form.Check.Label>
                    </Form.Check>
                    <Form.Group>
                        {feedback ? <div className={"text-danger fw-bold fst-italic"}>
                            {feedback}
                        </div> : null}
                        <Button variant={"primary"} className={"w-100 fs-5"} onClick={(e: any) => {
                            (async () => {
                                if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                    try {
                                        await AuthManager.login(login, password, remember);
                                        router.push("/");
                                    } catch (error: any) {
                                        if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                                            console.error(error);
                                            setFeedback("Неверный логин или пароль");
                                        } else setError(error);
                                    }
                                } else setValidated(true);
                            })();
                        }}>
                            Войти
                        </Button>
                    </Form.Group>
                </Form>
                <div className={"d-flex justify-content-between mt-2"}>
                    <Link href={"/"}>
                        <Button variant={"outline-dark"}>Назад </Button>
                    </Link>
                    <Link href={"/register"}>
                        <div className={"fs-5 fst-italic"}>Зарегистрироваться</div>
                    </Link>
                </div>
            </div>
        </div>
    </ErrorHandlerComponent>;
}