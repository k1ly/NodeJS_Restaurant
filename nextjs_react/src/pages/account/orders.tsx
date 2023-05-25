import AccountLayout from "@/pages/account/layout";
import {OrderListComponent} from "@/components/account/order-list.component";
import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import {ForbiddenError} from "@/errors/forbidden.error";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function Orders() {
    let [error, setError] = useState<Error>();
    let [auth, setAuth] = useState<any>();
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
        <AccountLayout auth={auth}>
            <OrderListComponent setError={setError} auth={auth}/>
        </AccountLayout>
    </ErrorHandlerComponent>;
}