import styles from './Registro.module.css'
import {useContext, useEffect} from "react";
import {AppContext} from "../../AppProvider";
import {useNavigate} from "react-router-dom";
import {FetchRequest} from "../../utils/FetchRequest";

function Registro(){
    const {registroState, setRegistroState} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === "photo") {
            setRegistroState(prev => ({
                ...prev,
                [name]: files[0]  // Guardamos el archivo (File object), no el value
            }));
        } else {
            setRegistroState(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    function submit(e){
        e.preventDefault();
        save();
    }

    async function save(){
        const formData = new FormData();

        formData.append("id", registroState.id);
        formData.append("nombre", registroState.nombre);
        formData.append("password", registroState.password);
        formData.append("rol", registroState.rol);

        if (registroState.photo) {
            formData.append("photo", registroState.photo);
        }
        const result = await FetchRequest( "/usuarios/register", {
            method: "POST",
            body: formData
        }, false);
        if (result) {
            localStorage.setItem('id', registroState.id);
            localStorage.setItem('rol', registroState.rol);
            localStorage.setItem('nombre', registroState.nombre);

            setRegistroState({
                id: '',
                nombre: '',
                password: '',
                rol: 'PACIENTE',
                photo: null
            });
            alert("Registro exitoso!.");
            navigate("/login");
        } else {
            alert("El ID digitado ya existe.");
        }
    }

    return (
        <>
            <RegistroForm entity={registroState}
                            handleChange={handleChange}
                            submit={submit}
            />
        </>
    );
}

function RegistroForm({entity, handleChange, submit}){
    return (
        <div className={styles.body}>
            <div className={styles["login-form"]}>
                <div className={styles["head-form"]}>Register</div>
                <form className={styles["body-form"]} encType="multipart/form-data" onSubmit={submit}>
                    <img className="perfil" src="/images/user.png" alt=""/>
                    <div>
                        <label htmlFor="nickname">
                            <img src="/images/userId.png" alt=""/>
                        </label>
                        <input type="text" id="id" name="id" value={entity.id} onChange={handleChange} placeholder="User id" required/>
                    </div>
                    <div>
                        <label htmlFor="password">
                            <img src="/images/key.png" alt=""/>
                        </label>
                        <input type="password" id="password" name="password" value={entity.password} onChange={handleChange} placeholder="User Password" required/>
                    </div>
                    <div>
                        <input type="text" id="nombre" name="nombre" value={entity.nombre} onChange={handleChange} placeholder="Nombre" required/>
                    </div>
                    <div>
                        <label htmlFor="photo">Foto</label>
                        <input type="file" id="photo" name="photo" onChange={handleChange} accept="image/*"/>
                    </div>
                    <div>
                        <label htmlFor="rol">Role</label>
                        <select id="rol" name="rol" value={entity.rol} onChange={handleChange} required>
                            <option value="PACIENTE">Paciente</option>
                            <option value="MEDICO">Médico</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>
                    <button className={styles.button} type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Registro;
