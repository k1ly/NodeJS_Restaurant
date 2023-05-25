import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import {useEffect, useState} from "react";

export function InternalServerErrorComponent() {
    let [timestamp, setTimestamp] = useState<Date>();
    useEffect(() => {
        setTimestamp(new Date());
    }, []);
    return <div className="d-flex justify-content-center align-items-center position-absolute vh-100 vw-100">
        <div>
            <h1>Непредвиденная ошибка :(</h1>
            {timestamp ? <h3>{timestamp.toLocaleString()}</h3> : null}
            <div className="d-inline-flex justify-content-center w-100 fw-bold fs-4">
                <Link href="/">Назад</Link>
            </div>
        </div>
    </div>;
}