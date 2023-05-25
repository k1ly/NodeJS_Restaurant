import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {Button} from "react-bootstrap";

export function DishInfoComponent({setError, dish, updateDish, deleteDish}: any) {
    let [category, setCategory] = useState<any>();
    const loadCategory = async () => {
        try {
            let categoryData = await ApiManager.get(`/api/categories/${dish.category}`);
            if (categoryData)
                setCategory(categoryData);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadCategory();
    }, []);
    return <tr>
        <td className={"fw-semibold"}>{dish.id}</td>
        <td>{dish.name}</td>
        <td>{dish.weight} г.</td>
        <td>{dish.price} р.</td>
        <td>{dish.discount} %</td>
        <td>{category?.name}</td>
        <td>
            <div>
                <div className={"d-flex justify-content-around float-end"}>
                    <Button variant={"outline-primary"}
                            onClick={() => updateDish()}
                            className={"mx-2"}>
                        Изменить
                    </Button>
                    <Button variant={"outline-danger"}
                            onClick={() => deleteDish()}
                            className={"mx-2"}>
                        Удалить
                    </Button>
                </div>
            </div>
        </td>
    </tr>;
}