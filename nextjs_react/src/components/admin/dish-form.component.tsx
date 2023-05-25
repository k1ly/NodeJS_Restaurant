import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {ImageUploadComponent} from "@/components/admin/image-upload.component";
import {Button, Form, Modal} from "react-bootstrap";
import {BadRequestError} from "@/errors/bad-request.error";
import {ConfigManager} from "@/util/config.manager";

export function DishFormComponent({setError, dish, addDish, updateDish, onClose}: any) {
    let [categories, setCategories] = useState<any[]>();
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [weight, setWeight] = useState(0);
    let [price, setPrice] = useState(0);
    let [discount, setDiscount] = useState(0);
    let [category, setCategory] = useState(0);
    let [image, setImage] = useState<any>();
    let [validated, setValidated] = useState(false);
    let [feedback, setFeedback] = useState<string>();
    const loadCategories = async () => {
        try {
            let categoriesData = await ApiManager.get("/api/categories");
            if (categoriesData)
                setCategories(categoriesData.content);
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadCategories();
    }, []);
    useEffect(() => {
        if (dish) {
            setName(dish.name ?? "");
            setDescription(dish.description ?? "");
            setWeight(dish.weight ?? 0);
            setPrice(dish.price ?? 0);
            setDiscount(dish.discount ?? 0);
            setCategory(dish.category ?? 0);
            setValidated(false);
            setFeedback(null);
        }
    }, [dish]);
    return <Modal show={!!dish} onHide={onClose} backdrop={"static"} keyboard={false} centered={true}>
        {dish ? <Form validated={validated}>
            <Modal.Header closeButton={true}>
                <Modal.Title className={"fs-4"}>
                    {dish.name ?? "Новое блюдо"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ImageUploadComponent imageUrl={`${ConfigManager.get("API_URL")}/${dish.imageUrl}`}
                                      setImage={setImage}/>
                <Form.Group>
                    <Form.Label htmlFor={"dishName"} className={"fs-5"}>Название</Form.Label>
                    <Form.Control type={"text"} name={"name"} required
                                  value={name}
                                  onChange={(e: any) => setName(e.target.value)}
                                  id={"dishName"}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor={"dishDescription"} className={"fs-5"}>Описание</Form.Label>
                    <Form.Control as={"textarea"} name={"description"} required
                                  value={description}
                                  onChange={(e: any) => setDescription(e.target.value)}
                                  id={"dishDescription"}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor={"dishWeight"} className={"fs-5"}>
                        Вес <span className={"fs-6"}>(грамм)</span>
                    </Form.Label>
                    <Form.Control type={"number"} name={"weight"} required
                                  min={0} value={weight}
                                  onChange={(e: any) => setWeight(Number(e.target.value))}
                                  id={"dishWeight"}/>
                    <Form.Label htmlFor={"dishWeight"} className={"fs-5"}>
                        Цена <span className={"fs-6"}>(рублей)</span>
                    </Form.Label>
                    <Form.Control type={"number"} step={"0.01"} name={"price"} required
                                  min={0} value={price}
                                  onChange={(e: any) => setPrice(Number(e.target.value))}
                                  id={"dishPrice"}/>
                    <Form.Label htmlFor={"dishWeight"} className={"fs-5"}>
                        Скидка <span className={"fs-6"}>( % )</span>
                    </Form.Label>
                    <Form.Control type={"number"} name={"discount"} required
                                  min={0} max={100} value={discount}
                                  onChange={(e: any) => setDiscount(Number(e.target.value))}
                                  id={"dishDiscount"}/>
                </Form.Group>
                {categories ? <Form.Group>
                    <Form.Label htmlFor={"dishCategory"} className={"fs-5"}>Категория</Form.Label>
                    <Form.Select name={"category"} required
                                 value={category}
                                 onChange={(e: any) => setCategory(Number(e.target.value))}
                                 id={"dishCategory"}>
                        <option value={0} disabled={true}>
                            ...
                        </option>
                        {categories.map((category: any) =>
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        )}
                    </Form.Select>
                </Form.Group> : null}
            </Modal.Body>
            <Modal.Footer>
                {feedback ? <div className={"w-100 text-danger fw-bold fst-italic"}>
                    {feedback}
                </div> : null}
                {dish.id ? <Button variant={"primary"} className={"w-100"}
                                   onClick={(e: any) => {
                                       (async () => {
                                           if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                               try {
                                                   await updateDish({
                                                       name,
                                                       description,
                                                       weight,
                                                       price,
                                                       discount,
                                                       category
                                                   }, image);
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
                </Button> : <Button variant={"primary"} className={"w-100"}
                                    onClick={(e: any) => {
                                        (async () => {
                                            if (e && (e.target as HTMLButtonElement).form.checkValidity()) {
                                                try {
                                                    await addDish({
                                                        name,
                                                        description,
                                                        weight,
                                                        price,
                                                        discount,
                                                        category
                                                    }, image);
                                                } catch (error: any) {
                                                    if (error instanceof BadRequestError) {
                                                        console.error(error);
                                                        setFeedback("Неверно введены данные!");
                                                    } else setError(error);
                                                }
                                            } else setValidated(true);
                                        })();
                                    }}>
                    Добавить
                </Button>}
            </Modal.Footer>
        </Form> : null}
    </Modal>;
}