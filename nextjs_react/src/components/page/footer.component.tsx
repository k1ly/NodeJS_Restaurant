import {createRef, useEffect} from "react";
import styles from "@/styles/page.module.sass";

export function FooterComponent({scrollOffset, setOffset, setHeight}: any) {
    let footer = createRef<HTMLDivElement>();
    useEffect(() => {
        setOffset(footer.current.offsetTop);
        setHeight(footer.current.clientHeight);
    }, [scrollOffset]);
    return <div ref={footer} className={styles["footer"]}>
        <div>©2023 LYSKOV KIRILL. RESTAURANT WEB PROJECT</div>
    </div>;
}