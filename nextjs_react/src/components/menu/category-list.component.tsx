import {Nav} from "react-bootstrap";
import Link from "next/link";
import clsx from "classnames";
import styles from "@/styles/menu.module.sass";
import queryString from "query-string";
import {SpinnerComponent} from "@/components/page/spinner.component";
import {createRef, useEffect, useState} from "react";
import {ApiManager} from "@/util/api.manager";
import "bootstrap/dist/css/bootstrap.min.css";
import {Pageable} from "@/components/page/pagination.component";

export default function CategoryListComponent({setError, category, size, sort}: any) {
    let [categories, setCategories] = useState<any[]>();
    let [pageable, setPageable] = useState<Pageable>({size: 10});
    const loadCategories = async () => {
        try {
            let categoriesData = await ApiManager.get("/api/categories", {
                size: pageable.size
            });
            if (categoriesData) {
                setCategories(categoriesData.content);
                setPageable(categoriesData.pageable);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        loadCategories();
    }, []);
    return <div className={styles["category-list"]}>
        {categories ? <Nav className={"flex-column"}>
            {categories.map((c: any) => <Link key={c.id} href={`?${queryString.stringify({
                category: c?.id, size, sort
            })}`} className={"text-decoration-none"}>
                <Nav.Link as={"div"} className={clsx(styles["category-nav-link"], {
                    [styles["active"]]: c.id === category?.id
                })}>
                    {c.name}
                </Nav.Link>
            </Link>)}
        </Nav> : null}
        <div className={styles["category-list-footer"]}>
            {!categories ? <SpinnerComponent size={"md"}/> : null}
        </div>
    </div>;
}