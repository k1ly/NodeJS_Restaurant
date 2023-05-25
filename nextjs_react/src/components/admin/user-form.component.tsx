import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Button, Form, Modal} from "react-bootstrap";
import {BadRequestError} from "@/errors/bad-request.error";

export function UserFormComponent({setError, user, editUser, onClose}: any) {
    let [roles, setRoles] = useState<any[]>();
    let [role, setRole] = useState(0);
    let [blocked, setBlocked] = useState(false);
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    const loadRoles = async () => {
        try {
            let rolesData = await ApiManager.get("/api/roles");
            if (rolesData)
                setRoles(rolesData);
        } catch (error: any) {
            setError(error);
        }
    }
    const loadRole = async () => {
        try {
            let roleData = await ApiManager.get("/api/roles/find", {
                name: user.role
            });
            if (roleData)
                setRole(roleData.id);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadRoles();
    }, []);
    useEffect(() => {
        if (user) {
            if (user.role)
                loadRole();
            else setRole(0);
            setBlocked(user.blocked ?? false);
            setValidated(false);
            setFeedback(null);
        }
    }, [user]);
    return <Modal show={!!user} onHide={onClose} backdrop={"static"} keyboard={false} centered={true}>
        {user ? <Form validated={validated}>
            <Modal.Header closeButton={true}>
                <Modal.Title className={"fs-4"}>
                    {user.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {roles ? <Form.Group>
                    <Form.Label htmlFor={"userRole"} className={"fs-5"}>Роль</Form.Label>
                    <Form.Select name={"role"} required
                                 value={role}
                                 onChange={(e: any) => setRole(Number(e.target.value))}
                                 id={"userRole"}>
                        <option value={0} disabled={true}>
                            ...
                        </option>
                        {roles?.map(role =>
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        )}
                    </Form.Select>
                </Form.Group> : null}
                <Form.Check className={"my-2"}>
                    <Form.Check.Input type={"checkbox"} name={"blocked"}
                                      value={"true"} checked={blocked}
                                      onChange={(e: any) => setBlocked(e.target.checked)}
                                      id={"userBlocked"}/>
                    <Form.Check.Label htmlFor={"userBlocked"} className={"fs-5"}>
                        Пользователь заблокирован
                    </Form.Check.Label>
                </Form.Check>
            </Modal.Body>
            <Modal.Footer>
                {feedback ? <div className={"w-100 text-danger fw-bold fst-italic"}>
                    {feedback}
                </div> : null}
                <Button variant={"primary"} className={"w-100"}
                        onClick={(e: any) => {
                            (async () => {
                                if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                    try {
                                        await editUser({blocked, role});
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
                </Button>
            </Modal.Footer>
        </Form> : null}
    </Modal>;
}