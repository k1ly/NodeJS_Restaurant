import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Account() {
    let router = useRouter();
    useEffect(() => {
        router.replace("/account/profile");
    }, [])
    return <></>;
}