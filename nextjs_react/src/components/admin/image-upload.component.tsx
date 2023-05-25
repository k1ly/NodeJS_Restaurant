import {useState} from "react";
import {Form, Image} from "react-bootstrap";
import clsx from "classnames";
import styles from "@/styles/admin.module.sass";
import "bootstrap/dist/css/bootstrap.min.css";

export function ImageUploadComponent({imageUrl, setImage}: any) {
    let [url, setUrl] = useState<string>(imageUrl);
    let [drag, setDrag] = useState(false);
    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            setDrag(true);
        else if (e.type === "dragleave")
            setDrag(false);
    };
    const handleImage = (e: any) => {
        e.preventDefault();
        let file: any;
        if (e.dataTransfer) {
            e.stopPropagation();
            setDrag(false);
            file = e.dataTransfer.files[0]
        } else file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            setImage(file);
            setUrl(reader.result.toString());
        }
        reader.readAsDataURL(file);
    }
    return <div>
        <div className={"d-flex justify-content-center p-3 w-100"}>
            <div className={clsx(styles ["dish-image-container"], {
                [styles["drag"]]: drag
            })} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
                 onDrop={handleImage}>
                {url ?
                    <Image className={"img-thumbnail w-100 h-100"} src={url} alt={"200x200"}/> : <>
                        Перетащите изображение сюда
                    </>}
            </div>
        </div>
        <Form.Control type={"file"} accept={"image/png, image/jpeg"} onChange={handleImage}/>
    </div>;
}