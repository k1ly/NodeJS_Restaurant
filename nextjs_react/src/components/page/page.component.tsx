import {useEffect, useState} from "react";
import {HeaderComponent} from "@/components/page/header.component";
import {FooterComponent} from "@/components/page/footer.component";
import clsx from "classnames";
import styles from "@/styles/page.module.sass";

export function PageComponent({setError, auth, children}: any) {
    let [scrollOffset, setScroll] = useState(0);
    let [offset, setOffset] = useState(0);
    let [height, setHeight] = useState(0);
    let [windowHeight, setWindowHeight] = useState(0);
    const handleScroll = () => setScroll(scrollY);
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);
    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, [scrollOffset]);
    return <div className={styles["page-container"]}>
        <HeaderComponent setError={setError} auth={auth} scrollOffset={scrollOffset} height={height}/>
        <div className={styles["content-wrap"]}>
            <div className={styles["content"]}>
                {children}
            </div>
        </div>
        <div className={clsx({
            ["invisible"]: !scrollOffset || scrollOffset <= height,
            ["opacity-0"]: !scrollOffset || scrollOffset <= height,
            ["position-fixed"]: !(scrollOffset >= offset - windowHeight && scrollOffset + height <= offset),
            [styles["scroll-footer"]]: scrollOffset >= offset - windowHeight && scrollOffset + height <= offset
        }, styles["scroll"])}
             style={{top: scrollOffset >= offset - windowHeight && scrollOffset + height <= offset ? offset - 60 - 30 : undefined}}
             onClick={() => scroll({top: 0, behavior: "smooth"})}>
            <svg width={25} height={25} viewBox={"-32 0 512 512"}>
                <path fill={"white"}
                      d={"m34.9 289.5-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"}/>
            </svg>
        </div>
        <FooterComponent scrollOffset={scrollOffset} setOffset={setOffset} setHeight={setHeight}/>
    </div>;
}