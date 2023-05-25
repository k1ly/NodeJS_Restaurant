import {PageComponent} from "@/components/page/page.component";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import {Card, Table} from "react-bootstrap";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export async function getServerSideProps() {
    let contacts = await import("../../resources/contacts.json");
    return {props: {contacts: contacts.default}};
}

export default function Contacts({contacts}: any) {
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
                <Card className={"w-50 shadow"}>
                    <Card.Header>
                        <Card.Title className={"text-center fs-2 fw-semibold"}>
                            Контакты
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {contacts ? <Table striped={true}>
                            <tbody>
                            <tr>
                                <td>
                                    <div className={"fs-5 fw-semibold fst-italic"}>Адрес</div>
                                </td>
                                <td className={"text-end"}>
                                    {contacts.addressList.map((address: any, i: number) =>
                                        <div
                                            key={i}>{address.locality}, {address.country}, {address.street} {address.house}</div>)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={"fs-5 fw-semibold fst-italic"}>Почта</div>
                                </td>
                                <td className={"text-end"}>
                                    {contacts.emailList.map((email: any, i: number) =>
                                        <div key={i}>{email}</div>)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={"fs-5 fw-semibold fst-italic"}>Телефон</div>
                                </td>
                                <td className={"text-end"}>
                                    {contacts.phoneList.map((phone: any, i: number) =>
                                        <div key={i}>{phone}</div>)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={"fs-5 fw-semibold fst-italic"}>Время работы</div>
                                </td>
                                <td className={"text-end"}>
                                    {contacts.workTimeList.map((workTime: any, i: number) =>
                                        <div key={i}>{workTime.days}: {workTime.from} - {workTime.to}</div>)}
                                </td>
                            </tr>
                            </tbody>
                        </Table> : null}
                    </Card.Body>
                </Card>
            </div>
        </PageComponent>
    </ErrorHandlerComponent>;
}