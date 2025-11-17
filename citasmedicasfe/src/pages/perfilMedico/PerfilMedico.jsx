import styles from './PerfilMedico.module.css';
import {AppContext} from "../../AppProvider";
import {useContext, useEffect} from "react";
import RequestImage from "../../components/RequestImage";
import {useNavigate} from "react-router-dom";
import {FetchRequest} from "../../utils/FetchRequest";

function PerfilMedico(){
    const {perfilMedicoState, setPerfilMedicoState, auth} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    function submit(e){
        e.preventDefault();
        update();
    }

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === "dias") {
            setPerfilMedicoState(prev => {
                const dias = prev.dias.includes(value)
                    ? prev.dias.filter(d => d !== value)
                    : [...prev.dias, value];

                return {
                    ...prev,
                    dias
                };
            });
        } else if (name === "photo") {
            setPerfilMedicoState(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setPerfilMedicoState(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    async function update() {
        const formData = new FormData();

        formData.append("nombre", auth.user.nombre);
        formData.append("horaInicio", perfilMedicoState.horaInicio);
        formData.append("horaFin", perfilMedicoState.horaFin);
        formData.append("especialidad", perfilMedicoState.especialidad);
        formData.append("ubicacion", perfilMedicoState.ubicacion);
        formData.append("hospital", perfilMedicoState.hospital);
        formData.append("costo", perfilMedicoState.costo);
        formData.append("frecuencia", perfilMedicoState.frecuencia);

        perfilMedicoState.dias.forEach(dia => formData.append("dias", dia));

        if (perfilMedicoState.photo) {
            formData.append("photo", perfilMedicoState.photo);
        }

        const result = await FetchRequest("/medicos/update", {
            method: "PUT",
            body: formData
        });

        if (result === true) {
            setPerfilMedicoState({
                password: '', rol:'',
                photo: null, ubicacion:'',
                hospital:'', dias: [],
                horaInicio:'', horaFin:'',
                especialidad:'', costo:'', frecuencia:'',
            });
            alert("Perfil actualizado exitosamente!.");
            navigate("/gestionCitas");
        } else if (result !== null) {
            alert("No se pudo actualizar el perfil.");
        }
    }

    return(
        <>
            <ProfileEditor entity={perfilMedicoState}
                           handleChange={handleChange}
                           update={update}
                           submit={submit}
                           auth={auth}
            />
        </>
    );
}

function ProfileEditor({entity, handleChange, auth, submit}){
    return (
        <div className={styles.body}>
            <div className={styles["login-form"]}>
                <div className={styles["head-form"]}><span>{auth.user.nombre}</span></div>

                <form className={styles["body-form"]} encType="multipart/form-data" onSubmit={submit}>
                    <RequestImage id={auth.user.id} className={styles.perfil}/>
                    <div>
                        <input type="text" id="nombre" name="nombre"
                               value={auth.user.nombre}
                               placeholder={auth.user.nombre}
                               onChange={handleChange}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="photo">Foto</label>
                        <input type="file" id="photo" name="photo" onChange={handleChange} accept="image/*"/>
                    </div>
                    <div className={styles.dias}>
                        <fieldset>
                            <legend>Días de trabajo</legend>
                            <div>
                                <label htmlFor="monday">Lunes</label>
                                <input type="checkbox" id="monday" name="dias" value="MONDAY" checked={entity.dias.includes("MONDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="tuesday">Martes</label>
                                <input type="checkbox" id="tuesday" name="dias" value="TUESDAY" checked={entity.dias.includes("TUESDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="wednesday">Miércoles</label>
                                <input type="checkbox" id="wednesday" name="dias" value="WEDNESDAY" checked={entity.dias.includes("WEDNESDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="thursday">Jueves</label>
                                <input type="checkbox" id="thursday" name="dias" value="THURSDAY" checked={entity.dias.includes("THURSDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="friday">Viernes</label>
                                <input type="checkbox" id="friday" name="dias" value="FRIDAY" checked={entity.dias.includes("FRIDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="saturday">Sábado</label>
                                <input type="checkbox" id="saturday" name="dias" value="SATURDAY" checked={entity.dias.includes("SATURDAY")}
                                       onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="sunday">Domingo</label>
                                <input type="checkbox" id="sunday" name="dias" value="SUNDAY" checked={entity.dias.includes("SUNDAY")}
                                       onChange={handleChange}/>
                            </div>
                        </fieldset>
                    </div>

                    <div className={styles["hora-inicio"]}>
                        Hora inicio
                        <input type="time" id="horaInicio" name="horaInicio" placeholder="Hora de inicio" onChange={handleChange} value={entity.horaInicio} required/>
                    </div>
                    <div className={styles["hora-fin"]}>
                        Hora fin
                        <input type="time" id="horaFin" name="horaFin" placeholder="Hora de finalización" onChange={handleChange} value={entity.horaFin} required/>
                    </div>
                    <div>
                        <input type="text" id="especialidad" name="especialidad" placeholder="Especialidad" onChange={handleChange} value={entity.especialidad} required/>
                    </div>
                    <div>
                        <input type="text" id="ubicacion" name="ubicacion" placeholder="Ciudad" onChange={handleChange} value={entity.ubicacion} required/>
                    </div>
                    <div>
                        <input type="text" id="hospital" name="hospital" placeholder="Hospital" onChange={handleChange} value={entity.hospital} required/>
                    </div>
                    <div>
                        <input type="number" id="costo" name="costo" placeholder="Costo de consulta" onChange={handleChange} value={entity.costo}
                               required/>
                    </div>
                    <div>
                        <input type="number" id="frecuencia" name="frecuencia" placeholder="Frecuencia (30, 60, 120...)"
                               step="1" onChange={handleChange} value={entity.frecuencia} required/>
                    </div>
                    <button className={styles.button} type="submit">Actualizar</button>
                </form>
            </div>
        </div>
    );
}

export default PerfilMedico;