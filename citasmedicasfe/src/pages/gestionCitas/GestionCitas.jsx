import styles from './GestionCitas.module.css'
import {AppContext} from "../../AppProvider";
import stylesBuscarCita from '../buscarCita/BuscarCita.module.css'
import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import RequestImage from "../../components/RequestImage";
import {FetchRequest} from "../../utils/FetchRequest";

function GestionCitas(){
    const {gestionCitaState, setGestionCitaState, auth} = useContext(AppContext);
    const [flag, setFlag] = useState(false);

    useEffect(() => {}, []);

    async function search() {
        const citas = await FetchRequest(`/citas/statusAndPaciente`, {
            method: 'POST',
            body: JSON.stringify({
                status: gestionCitaState.busqueda.status,
                paciente: gestionCitaState.busqueda.paciente,
            })
        }, true);

        if (citas) {
            setGestionCitaState(prev => ({
                ...prev,
                citas: citas
            }));
        }
        setFlag(true);
    }

    function handleChange(event){
        const {value, name} = event.target;
        setGestionCitaState(prev =>({
            ...prev,
            busqueda:{
                ...prev.busqueda,
                [name]: value
            }
        }));
    }

    async function discard(id){
        const result = await FetchRequest(`/citas/delete/${id}`, {
            method: 'DELETE',
        }, true);

        if (result !== null) {
            setGestionCitaState(prev => ({
                ...prev,
                citas: prev.citas.filter(cita => cita.id !== id)
            }));
        }
    }

    async function accept(id){
        const result = await FetchRequest(`/citas/accept/${id}`, {
            method: 'PUT',
        });

        if (result !== null) {
            setGestionCitaState(prev => ({
                ...prev,
                citas: prev.citas.map(cita =>
                    cita.id === id ? { ...cita, estado: true } : cita
                )
            }));
        }
    }

    return(
        <AppointmentManagementPanel entity={gestionCitaState}
                                    handleChange={handleChange}
                                    search={search}
                                    discard={discard}
                                    accept={accept}
                                    auth={auth}
                                    flag={flag}
        />
    );
}

function AppointmentManagementPanel({entity, handleChange, search, discard, accept, auth, flag}){
    return(
        <div className={styles.body}>
            <DoctorSummaryHeader auth={auth}/>
            <div className={styles.line}></div>
            <AppointmentFilterForm entity={entity}
                                   handleChange={handleChange}
                                   search={search}/>
            <div className={styles.line}></div>
            <AppointmentList entity={entity}
                             discart={discard}
                             accept={accept}
                             flag={flag}
            />
        </div>
    );
}

function DoctorSummaryHeader({auth}){
    return(
        <div className={styles.doctor}>
            <p>Doctor - </p>
            <p>{auth.user.nombre}</p>
            <p>- appoitments </p>
        </div>
    );
}

function AppointmentFilterForm({entity, handleChange, search}){
    return(
        <form className={stylesBuscarCita.form}>
            <label className={stylesBuscarCita.label} htmlFor="status">Status</label>
            <select id="status" name="status" value={entity.busqueda.status} onChange={handleChange} required>
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>citas
                <option value="ATTENDED">Attended</option>
            </select>

            <label className={stylesBuscarCita.label} htmlFor="paciente">Patient</label>
            <input className={stylesBuscarCita.input} type="text" id="paciente" name="paciente" value={entity.busqueda.paciente} onChange={handleChange}/>
            <button className={stylesBuscarCita.button} type="button" onClick={search}>Search</button>
        </form>
    );
}

function AppointmentList({ entity, accept, discart, flag}) {
    if (flag && (!entity.citas || entity.citas.length === 0)) {
        return (
            <div className={styles.notFound}>
                <p>No appointments were found.</p>
            </div>
        );
    }

    return (
        <>
            {entity.citas.map((cita) => (
                <div className={styles.cita} key={cita.id}>
                    <div className={styles.paciente}>
                        <RequestImage id={cita.idPaciente.id}/>
                        <p>{cita.idPaciente.nombre}</p>
                        <div>
                            <p>{cita.fecha}</p>
                            <span>-</span>
                            <p>{cita.hora}</p>
                        </div>

                        <p className={cita.estado ? styles.attended : styles.pending}>
                            {cita.estado ? 'Attended' : 'Pending'}
                        </p>

                        {cita.estado ? (
                            <div className={styles.ver}>
                                <Link
                                    to="/citas/ver"
                                    state={cita}
                                    className={styles["view-button"]}>
                                    <img src="/images/view.png" alt="" />
                                    view
                                </Link>
                            </div>
                        ) : (
                            <div className={styles["aceptar-cancelar"]}>
                                <button
                                    onClick={()=>accept(cita.id)}
                                    className={styles["attend-button"]}>
                                    <img src="/images/attend.png" alt="" />
                                    Attend
                                </button>
                                <button
                                    onClick={()=>discart(cita.id)}
                                    className={styles["cancel-button"]}>
                                    <img src="/images/cancel.png" alt="" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.line}></div>
                </div>
            ))}
        </>
    );
}

export default GestionCitas;