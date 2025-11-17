import stylesHistoricoCitas from './HistoricoCitas.module.css'
import stylesBuscarCita from '../buscarCita/BuscarCita.module.css'
import stylesGestionCitas from '../gestionCitas/GestionCitas.module.css'
import {Link} from "react-router-dom";
import {AppContext} from "../../AppProvider";
import {FetchRequest} from "../../utils/FetchRequest";
import {useContext, useEffect, useState} from "react";
import RequestImage from "../../components/RequestImage";

function HistoricoCitas(){
    const {historicoCitaState, setHistoricoCitaState, auth} = useContext(AppContext);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
    }, []);

    function handleChange(event){
        const {value, name} = event.target;
        setHistoricoCitaState(prev =>({
            ...prev,
            busqueda:{
                ...prev.busqueda,
                [name]: value
            }
        }));
    }

    async function search() {
        const citas = await FetchRequest(`/citas/statusAndMedico`, {
            method: "POST",
            body: JSON.stringify({
                status: historicoCitaState.busqueda.status,
                medico: historicoCitaState.busqueda.medico,
            })}, true
        );
        if (citas){
            setHistoricoCitaState(prev => ({
                ...prev,
                citas: citas
            }));
        }
        setFlag(true);
    }

    return(
        <AppointmentManagementPanel entity={historicoCitaState}
                                    handleChange={handleChange}
                                    search={search}
                                    auth={auth}
                                    flag={flag}
        />
    );
}

function AppointmentManagementPanel({entity, handleChange, search, auth, flag}){
    return(
        <div className={stylesGestionCitas.body}>
            <PatientSummaryHeader auth={auth}/>
            <div className={stylesGestionCitas.line}></div>
            <AppointmentFilterForm entity={entity}
                                   handleChange={handleChange}
                                   search={search}
            />
            <div className={stylesGestionCitas.line}></div>
            <AppointmentList citas={entity.citas}
                             flag={flag}
            />
        </div>
    );
}

function PatientSummaryHeader({auth}){
    return(
        <div className={stylesGestionCitas.doctor}>
            <p>Patient - </p>
            <p>{auth.user.nombre}</p>
            <p>- appoitments history </p>
        </div>
    );
}

function AppointmentFilterForm({entity, handleChange, search}){
    return(
        <form className={stylesBuscarCita.form}>
            <label className={stylesBuscarCita.label} htmlFor="status">Status</label>
            <select id="status" name="status" value={entity.busqueda.status} onChange={handleChange} required>
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="ATTENDED">Attended</option>
            </select>

            <label className={stylesBuscarCita.label} htmlFor="medico">Doctor</label>
            <input className={stylesBuscarCita.input} type="text" id="medico" name="medico" value={entity.busqueda.medico} onChange={handleChange}/>
            <button className={stylesBuscarCita.button} type="button" onClick={search}>Search</button>
        </form>
    );
}

function AppointmentList({citas, flag}){
    if (flag && (!citas || citas.length === 0)) {
        return (
            <div className={stylesHistoricoCitas.notFound}>
                <p>No appointment history found.</p>
            </div>
        );
    }

    return (
        <>
            {citas.map((cita) => (
                <div className={stylesGestionCitas.cita} key={cita.id}>
                    <div className={stylesHistoricoCitas.container}>
                        <div className={stylesBuscarCita.informacion}>
                            <div className={stylesBuscarCita.detalle}>
                                <RequestImage id={cita.idMedico.id}/>
                                <div>
                                    <div>
                                        <p>{cita.idMedico.nombre}</p>
                                        <p>{cita.idMedico.id}</p>
                                    </div>
                                    <p>{cita.idMedico.especialidad}</p>
                                </div>
                            </div>
                            <div className={stylesBuscarCita.line}></div>
                            <div>
                                <p>{cita.idMedico.hospital}</p>
                                <span>@</span>
                                <p>{cita.idMedico.ubicacion}</p>
                            </div>
                        </div>

                        <div>
                            <p>{cita.fecha}</p>
                            -
                            <p>{cita.hora}</p>
                        </div>

                        <p className={cita.estado ? stylesGestionCitas.attended : stylesGestionCitas.pending}>
                            {cita.estado ? 'Attended' : 'Pending'}
                        </p>

                        {cita.estado && (
                            <div className="ver">
                                <Link
                                    to={"/citas/citaPaciente"}
                                    state={cita}
                                    className={stylesGestionCitas["view-button"]}>
                                    <img src="/images/view.png" alt="" />
                                    view
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className={stylesGestionCitas.line}></div>
                </div>
            ))}
        </>
    );
}

export default HistoricoCitas;