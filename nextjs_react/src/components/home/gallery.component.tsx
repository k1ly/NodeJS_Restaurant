import {useState} from "react";
import {Carousel, Image} from "react-bootstrap";

export function GalleryComponent() {
    let [index, setIndex] = useState(0);
    return <div className={"d-flex justify-content-center"}>
        <div className={"w-75"}>
            <Carousel activeIndex={index} onSelect={(i) => setIndex(i)}>
                <Carousel.Item>
                    <Image src={"/img/gallery1.jpg"} alt="Первый слайд" className={"d-block w-100"}/>
                    <Carousel.Caption>
                        <h5>Хороший вид</h5>
                        <p>Ресторан располагается в самом красивом месте!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={"/img/gallery2.jpg"} alt="Второй слайд" className={"d-block w-100"}/>
                    <Carousel.Caption>
                        <h5>Чистота и порядок</h5>
                        <p>Мы сделаем все, чтобы вы чувствовали себя как дома или даже лучше...</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={"/img/gallery3.jpg"} alt="Третий слайд" className={"d-block w-100"}/>
                    <Carousel.Caption>
                        <h5>Кухня Шефа</h5>
                        <p>Професионалы своего дела приготовят для вас свои деликатесы...</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={"/img/gallery4.jpg"} alt="Четвертый слайд" className={"d-block w-100"}/>
                    <Carousel.Caption>
                        <h5>Блюда на выбор</h5>
                        <p>Разнообразное меню для которого используются только продукты высшего качества!</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    </div>;
}