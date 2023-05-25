import {Spinner} from "react-bootstrap";
import styles from "@/styles/page.module.sass";

export function SpinnerComponent({variant, size}: any) {
    return <div className={"d-flex justify-content-center align-items-center flex-fill"}>
        <Spinner variant={variant} className={styles[`spinner-${size}`]}/>
    </div>;
}