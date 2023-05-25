import {useEffect, useState} from "react";
import AccountLayout from "@/pages/account/layout";
import {ProfileComponent} from "@/components/account/profile.component";
import {ApiManager} from "@/util/api.manager";
import {AuthManager} from "@/util/auth.manager";
import {useRouter} from "next/navigation";
import styles from "@/styles/account.module.sass";
import {Button, Toast} from "react-bootstrap";
import {ForbiddenError} from "@/errors/forbidden.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function Profile() {
    let [error, setError] = useState<Error>();
    let [auth, setAuth] = useState<any>();
    let [alertPrompt, setAlertPrompt] = useState(false);
    let router = useRouter();
    const updateUser = async (userDto: any) => {
        await ApiManager.put(`/api/users/${auth.id}`, userDto);
        setAlertPrompt(true);
    }
    useEffect(() => {
        (async () => {
            try {
                let authData = await AuthManager.authenticate();
                if (authData?.role?.match(/^(CLIENT|MANAGER|ADMIN)$/))
                    setAuth(authData);
                else setError(new ForbiddenError("Account"));
            } catch (error: any) {
                setError(error);
            }
        })();
    }, []);
    return <ErrorHandlerComponent error={error}>
        <AccountLayout setError={setError} auth={auth}>
            <div className={styles["alert"]}>
                <Toast onClose={() => {
                    setAlertPrompt(false);
                    router.push("/account");
                }} show={alertPrompt} delay={3000}>
                    <Toast.Header closeButton={false}>
                        <div className={"w-100 fs-5 text-center"}>Профиль</div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"text-center"}>Данные изменены!</div>
                        <div className={"d-flex justify-content-center w-100"}>
                            <Button variant={"primary"} size={"sm"} onClick={() => {
                                setAlertPrompt(false);
                                router.push("/account");
                            }}>ОК</Button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <ProfileComponent auth={auth} updateUser={updateUser}/>
        </AccountLayout>
    </ErrorHandlerComponent>;
}