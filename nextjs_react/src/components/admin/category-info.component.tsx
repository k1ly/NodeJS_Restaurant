import {Button} from "react-bootstrap";

export function CategoryInfoComponent({category, updateCategory, deleteCategory}: any) {
    return <tr>
        <td className={"fw-semibold"}>{category.id}</td>
        <td>{category.name}</td>
        <td>
            <div>
                <div className={"d-flex justify-content-around float-end"}>
                    <Button variant={"outline-primary"}
                            onClick={() => updateCategory()}
                            className={"mx-2"}>
                        Изменить
                    </Button>
                    <Button variant={"outline-danger"}
                            onClick={() => deleteCategory()}
                            className={"mx-2"}>
                        Удалить
                    </Button>
                </div>
            </div>
        </td>
    </tr>;
}