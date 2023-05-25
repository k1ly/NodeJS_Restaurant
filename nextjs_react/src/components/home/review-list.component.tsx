import {useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import {ReviewInfoComponent} from "@/components/home/review-info.component";
import {ReviewFormComponent} from "@/components/home/review-form.component";
import {Pageable, PaginationComponent} from "@/components/page/pagination.component";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {Stack, Toast} from "react-bootstrap";
import styles from "@/styles/admin.module.sass";

export function ReviewListComponent({setError, auth}: any) {
    let [reviews, setReviews] = useState<any[]>();
    let [total, setTotal] = useState<number>();
    let [pageable, setPageable] = useState<Pageable>({sort: "date", order: "asc"});
    let [notification, setNotification] = useState<string>();
    const loadReviews = async () => {
        try {
            let reviewsData = await ApiManager.get("/api/reviews", {
                page: pageable.page,
                sort: `${pageable.sort},${pageable.order}`
            });
            if (reviewsData) {
                setReviews(reviewsData.content);
                setTotal(reviewsData.total);
                setPageable(reviewsData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    const addReview = async (reviewDto: any) => {
        await ApiManager.post("/api/reviews", reviewDto);
        setNotification("Отзыв успешно добавлен!");
        loadReviews();
    }
    useEffect(() => {
        loadReviews();
    }, []);
    return <div className={"flex-fill mx-4"}>
        <Toast onClose={() => setNotification(null)} show={!!notification} delay={5000} autohide={true}
               className={styles["notification"]}>
            <Toast.Header>
                <div className={"me-auto fs-5"}>Новый отзыв</div>
            </Toast.Header>
            <Toast.Body>{notification}</Toast.Body>
        </Toast>
        <div className={"my-3 border-3 border-top text-white fs-2"}>Отзывы</div>
        {reviews ? <>
            {total > 0 ? <>
                <PaginationComponent total={total} pageable={pageable} setPage={(page: number) => {
                    pageable.page = page;
                    loadReviews();
                }}/>
                <Stack>
                    {reviews.map((review: any) => <ReviewInfoComponent key={review.id} review={review}/>)}
                </Stack>
            </> : <div className={"d-flex justify-content-center align-items-center m-5"}>
                <div className={"text-white fs-4"}>Отзывов пока нет, будьте первыми!</div>
            </div>}
        </> : <div className={"m-5"}>
            <SpinnerComponent variant={"light"}/>
        </div>}
        <ReviewFormComponent setError={setError} auth={auth} addReview={addReview}/>
    </div>;
}