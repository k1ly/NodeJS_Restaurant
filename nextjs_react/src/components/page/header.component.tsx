import {AuthManager} from "@/util/auth.manager";
import {Button, Dropdown, Nav, Navbar} from "react-bootstrap";
import clsx from "classnames";
import styles from "@/styles/page.module.sass";
import {useRouter} from "next/navigation";
import Link from "next/link";

export function HeaderComponent({setError, auth, scrollOffset, height}: any) {
    let router = useRouter();
    return <div className={clsx(styles["header-container"], {
        [styles["scrolled"]]: scrollOffset > height
    })}>
        <Navbar className={styles["header"]}>
            <div className={styles["header-left"]}>
                <Nav className={"d-flex justify-content-around align-items-center w-100"}>
                    <Nav.Item>
                        <Link href={"/"} className={styles["nav-bar-link"]}>ГЛАВНАЯ</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href={"/menu?category=1"} className={styles["nav-bar-link"]}>МЕНЮ</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href={"/contacts"} className={styles["nav-bar-link"]}>КОНТАКТЫ</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href={"/about"} className={styles["nav-bar-link"]}>О НАС</Link>
                    </Nav.Item>
                </Nav>
            </div>
            <Navbar.Brand>
                <Link href={"/"} className={styles["logo"]}>Restaurant</Link>
            </Navbar.Brand>
            <div className={styles["header-right"]}>
                {auth ? <>
                    <div className={styles["cart"]}>
                        <Link href={"/cart"}>
                            <svg width={35} height={35} viewBox="0 0 35 30.227">
                                <path
                                    d={"M14.318 26.25h6.364M1.591 1.591h3.713c.778 0 1.442.564 1.569 1.331l2.672 16.169-.723 3.182M7.954 6.364h24.659a.796.796 0 0 1 .764 1.016l-2.614 9.058a1.593 1.593 0 0 1-1.408 1.146L9.562 19.091m15.893 10.341a2.386 2.386 0 1 0-.001-4.775 2.386 2.386 0 0 0 .001 4.775Zm-1.125-4.773h2.25l1.26 1.262v2.25l-1.26 1.261h-2.25l-1.262-1.261v-2.25l1.262-1.262ZM9.545 29.432a2.387 2.387 0 1 0 0-4.774 2.387 2.387 0 0 0 0 4.774ZM8.42 24.659h2.25l1.262 1.262v2.25l-1.262 1.261H8.42l-1.26-1.261v-2.25l1.26-1.262Z"}
                                    stroke={"#fff"} fill={"none"}/>
                            </svg>
                        </Link>
                    </div>
                    {auth.role?.match(/^(GUEST)$/) ?
                        <div className={styles["guest-actions"]}>
                            <Link href={"/register"}>
                                <Button variant={"success"}>Регистрация</Button>
                            </Link>
                            <Link href={"/login"}>
                                <Button variant={"outline-success"}>Вход</Button>
                            </Link>
                        </div> : null}
                    {auth.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ?
                        <Dropdown>
                            <Dropdown.Toggle variant={"outline-light"}>
                                <div className={"d-inline-flex fs-5 fw-semibold"}>
                                    <div className={styles["user-avatar"]}>{auth.name[0].toUpperCase()}</div>
                                    <span className={"mx-2 pt-1"}>{auth.name}</span>
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={"/account"}
                                               className={"fw-semibold text-center text-decoration-none"}>
                                    Личный кабинет
                                </Dropdown.Item>
                                {auth.role?.match(/^(MANAGER|ADMIN)$/) ?
                                    <Dropdown.Item href={"/managing"}
                                                   className={"fw-semibold text-center text-decoration-none"}>
                                        Заказы
                                    </Dropdown.Item> : null}
                                {auth.role?.match(/^(ADMIN)$/) ? <Dropdown.Item href={"/admin"}
                                                                                className={"fw-semibold text-center text-decoration-none"}>
                                    Администрация
                                </Dropdown.Item> : null}
                                <Dropdown.Item>
                                    <Button variant={"outline-danger"} size={"sm"}
                                            onClick={() => {
                                                (async () => {
                                                    try {
                                                        await AuthManager.logout();
                                                        router.push("/");
                                                    } catch (error: any) {
                                                        setError(error);
                                                    }
                                                })();
                                            }}>
                                        Выйти из аккаунта
                                    </Button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> : null}
                </> : null}
            </div>
        </Navbar>
    </div>;
}