import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import {PageComponent} from "@/components/page/page.component";
import styles from "@/styles/about.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function About() {
    let [error, setError] = useState<Error>();
    let [auth, setAuth] = useState<any>();
    useEffect(() => {
        (async () => {
            try {
                let authData = await AuthManager.authenticate();
                if (authData)
                    setAuth(authData);
            } catch (error: any) {
                setError(error);
            }
        })();
    }, []);
    return <ErrorHandlerComponent error={error}>
        <PageComponent setError={setError} auth={auth}>
            <div className={"d-flex justify-content-center align-items-center h-100"}>
                <div className={styles["about"]}>
                    Лучший ресторан в городе! Благодаря современному дизайну, теплым тонам и видам на набережную, наш
                    дизайн
                    создан для того, чтобы вы
                    чувствовали себя комфортно и по-домашнему.

                    В меню будут представлены продукты высочайшего качества, и наши гости получат качество и постоянство
                    блюд, которых нет нигде в во всем свете.
                </div>
            </div>
        </PageComponent>
    </ErrorHandlerComponent>;
}