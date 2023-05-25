import {usePathname} from "next/navigation";
import {PageComponent} from "@/components/page/page.component";
import clsx from "classnames";
import styles from "@/styles/account.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {Nav} from "react-bootstrap";
import Link from "next/link";

export default function AccountLayout({setError, auth, children}: any) {
    let path = usePathname();
    return <PageComponent setError={setError} auth={auth}>{
        auth?.role?.match(/^(CLIENT|MANAGER|ADMIN)$/) ?
            <div className={"d-flex flex-column h-100"}>
                <div className={"m-3 border-3 border-bottom text-start text-white fs-2 rounded-top"}>
                    Ваш аккаунт
                </div>
                <div className={"d-flex flex-column flex-fill mx-5"}>
                    <Nav className={clsx("nav-tabs", styles["nav-tab-header"])}>
                        <Nav.Item>
                            <Link href={"/account/profile"} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["nav-tab-link"], {
                                    [styles["active"]]: path === "/account/profile"
                                })}>
                                    Профиль
                                </Nav.Link>
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link href={"/account/orders"} className={"text-decoration-none"}>
                                <Nav.Link as={"div"} className={clsx(styles["nav-tab-link"], {
                                    [styles["active"]]: path === "/account/orders"
                                })}>
                                    История заказов
                                </Nav.Link>
                            </Link>
                        </Nav.Item>
                    </Nav>
                    <div className={"d-flex justify-content-center align-items-center flex-fill"}>
                        {children}
                    </div>
                </div>
            </div> : <div className={"d-flex justify-content-center align-items-center h-100"}>
                <div className={"text-white fs-4"}>У вас недостаточно привелегий просматривать эту страницу</div>
            </div>}
    </PageComponent>;
}