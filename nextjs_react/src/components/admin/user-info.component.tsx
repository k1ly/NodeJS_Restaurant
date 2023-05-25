import styles from "@/styles/admin.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button} from "react-bootstrap";

export function UserInfoComponent({user, editUser}: any) {
    return <tr>
        <td className={"fw-semibold"}>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email ?? <span className={styles["null-table-cell"]}></span>}</td>
        <td>{user.phone ?? <span className={styles["null-table-cell"]}></span>}</td>
        <td>{user.blocked ? "Заблокирован" : ""}</td>
        <td>{user.role}</td>
        <td>
            <div>
                <div className={"d-flex justify-content-around float-end"}>
                    <Button variant={"outline-primary"}
                            disabled={user.role === "ADMIN"}
                            onClick={() => editUser()}
                            className={"mx-2"}>
                        Изменить
                    </Button>
                </div>
            </div>
        </td>
    </tr>;
}