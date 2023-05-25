import {PageComponent} from "@/components/page/page.component";
import {GalleryComponent} from "@/components/home/gallery.component";
import {ReviewListComponent} from "@/components/home/review-list.component";
import {Button, Image} from "react-bootstrap";
import styles from "@/styles/home.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {AuthManager} from "@/util/auth.manager";
import Link from "next/link";
import {ErrorHandlerComponent} from "@/components/error/error-handler.component";

export default function Home() {
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
            <div className={"d-flex flex-column h-100"}>
                <div className={styles["info-header"]}>
                    <div className={styles["info-about"]}>
                        <div className={"my-5 fs-3"}>
                            Место, куда захочется вернуться!
                        </div>
                        <div className={"fs-5 lh-lg"}>
                            Благодаря современному дизайну, теплым тонам и видам на набережную, наш дизайн создан для
                            того,
                            чтобы вы
                            чувствовали себя комфортно и по-домашнему.

                            В меню будут представлены продукты высочайшего качества, и наши гости получат качество и
                            постоянство
                            блюд, которых нет нигде в нашем городе.
                        </div>
                    </div>
                </div>
                <div className={styles["info-showcase"]}>
                    <Image src={"/img/dish.jpg"} alt={"Блюдо"} className={styles["info-dish"]}/>
                    <div className={styles["info-menu"]}>
                        <div className={"my-5 fs-3"}>
                            Каждый найдет что-нибудь свое...
                        </div>
                        <div className={"fs-5 lh-base"}>
                            Что же такого особенного у нас в меню?
                            Все блюда приговлены лучшими поварами проффесионалами! Только свежые продукты попадают к нам
                            на
                            кухню,
                            здесь вы можете отведать ваши любимые блюда или попробовать что-нибудь новенькое.
                            Нет необходимости в чем-то себе отказывать, доступные цены не оставят никого равнодушным,
                            а если вы любите покушать дома с друзьями или в кругу семьи, наша доставка поможет вам с
                            этим!
                        </div>
                        <Link href={"/menu?category=1"}>
                            <Button variant={"dark"} size={"lg"} className={"m-4 float-end rounded-pill"}>Скорее в
                                меню</Button>
                        </Link>
                    </div>
                </div>
                <div className={styles["info-container"]}>
                    <div className={styles["info-extra"]}>
                        <div className={"fs-4 lh-base"}>
                            Нам очень важна ваша оценка, поэтому оставляйте свои отзывы и не забывайте забывайте писать
                            на
                            почту либо звонить по номеру,
                            если возникнут какие-либо вопросы или пожелания по улучшению нашего сервиса.

                            Благодарим, что посетили наш ресторан, обязательно приходите еще!
                        </div>
                    </div>
                </div>
                <GalleryComponent/>
                <ReviewListComponent setError={setError} auth={auth}/>
            </div>
        </PageComponent>
    </ErrorHandlerComponent>;
}