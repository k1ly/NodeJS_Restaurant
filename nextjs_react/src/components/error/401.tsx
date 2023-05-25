import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export function UnauthorizedComponent() {
    return <div className="d-flex justify-content-center align-items-center position-absolute vh-100 vw-100">
        <div className={"text-center"}>
            <h1>Ой, кажется вы не авторизовались...</h1>
            <div className="d-inline-flex justify-content-center w-100 fw-bold fs-4">
                <Link href="/">Назад</Link>
            </div>
        </div>
    </div>;
}