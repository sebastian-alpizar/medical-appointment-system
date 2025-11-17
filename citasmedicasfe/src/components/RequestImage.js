import {useEffect, useState} from "react";
const API_URL = process.env.REACT_APP_API_URL;

function RequestImage({ id, className= ""}) {
    const [imageUrl, setImageUrl] = useState("/images/perfil.png");

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        fetch(API_URL + `/usuarios/photo/${id}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok || res.headers.get('content-length') === '0') {
                    return Promise.reject("Image not found or empty");
                }
                return res.blob();
            })
            .then(blob => {
                if (blob.size === 0) throw new Error("Empty blob");
                const objectURL = URL.createObjectURL(blob);
                setImageUrl(objectURL);
            })
            .catch(() => {
                setImageUrl("/images/perfil.png"); // Imagen por defecto
            });

        return () => controller.abort();
    }, [id]);

    return <img src={imageUrl} className={className} alt=""/>;
}
export default RequestImage;