import styles from './BuscarCita.module.css';
import { AppContext } from '../../AppProvider';
import {useContext, useEffect, useState} from "react";
import { FetchRequest } from '../../utils/FetchRequest';
import RequestImage from "../../components/RequestImage";
import {Link} from "react-router-dom";

function BuscarCita() {
    const { buscarCitaState, setBuscarCitaState } = useContext(AppContext);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setBuscarCitaState(prev => ({
            ...prev,
            medico: {
                ...prev.medico,
                [name]: value
            }
        }));
    }

    async function cargarHorarios(medicosIds) {
        const params = new URLSearchParams();
        medicosIds.forEach(id => params.append('idMedicos', id));
        const horarios = await FetchRequest(`/horarios?` + params.toString(), {}, false);
        if (horarios) {
            setBuscarCitaState(prev => ({
                ...prev,
                horarios
            }));
        }
    }

    async function search(event) {
        event.preventDefault();
        setFlag(true);

        const params = new URLSearchParams({
            especialidad: buscarCitaState.medico.especialidad,
            ubicacion: buscarCitaState.medico.ubicacion
        });

        const medicosFiltrados = await FetchRequest(`/medicos/search?` + params.toString(), {}, false);
        if (medicosFiltrados && medicosFiltrados.length > 0) {
            setBuscarCitaState(prev => ({
                ...prev,
                medicos: medicosFiltrados
            }));
            const medicos = medicosFiltrados.map(medico => medico.id);
            cargarHorarios(medicos);
        }
        else {
            setBuscarCitaState(prev => ({
                ...prev,
                medicos: [],
                horarios: []
            }));
        }
    }

    return (
        <div className={styles.body}>
            <div>
                <DoctorFilterForm
                    entity={buscarCitaState.medico}
                    handleChange={handleChange}
                    search={search}
                />
                <DoctorList entity={buscarCitaState}
                            flag={flag}
                />
            </div>
        </div>
    );
}

function DoctorFilterForm({entity, handleChange, search}){
    return (
        <form className={styles.form} onSubmit={search}>
            <label htmlFor="especialidad" className={styles.label}>Speciality</label>
            <input type="text" id="especialidad" name="especialidad" className={styles.input} value={entity.especialidad} onChange={handleChange}/>
            <label htmlFor="ubicacion" className={styles.label}>City</label>
            <input type="text" id="ubicacion" name="ubicacion" className={styles.input} value={entity.ubicacion} onChange={handleChange}/>
            <button type="submit" className={styles.button}>Search</button>
        </form>
    );
}

function DoctorList({ entity, flag }) {
    const {medicos} = entity;
    if (flag && (!medicos || medicos.length === 0)) {
        return (
            <div className={styles.notFound}>
                <p>No doctors were found.</p>
            </div>
        );
    }

    return (
        <>
            {medicos.map((medico) => (
                <div className={styles.medico} key={medico.id}>
                    <div className={styles.informacion}>
                        <div className={styles.detalle}>
                            <RequestImage id={medico.id}/>
                            <div>
                                <div>
                                    <p>{medico.nombre}</p>
                                    <p>{medico.id}</p>
                                </div>
                                <p>{medico.especialidad}</p>
                            </div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <p>{medico.hospital}</p>
                            <span>@</span>
                            <p>{medico.ubicacion}</p>
                        </div>
                    </div>
                    <ScheduleList horarios={entity.horarios} medico={medico} />
                </div>
            ))}
        </>
    );
}

function ScheduleList({ horarios, medico }) {
    const horariosFiltrados = horarios.filter(h => h.idMedico === medico.id);

    return (
        <>
            <div className={styles["horarios-container"]}>
                {horariosFiltrados.map(horario => (
                    <div key={`${horario.idMedico}-${horario.fecha}`} className={styles["horario-box"]}>
                        <h3>{horario.fecha}</h3>
                        <div className={styles.espacios}>
                            {horario.espacios.map((espacio) => (
                                <Link
                                    key={`${horario.idMedico}-${horario.fecha}-${espacio.espacio}`}
                                    to="/confirmarCita"
                                    state={{medico, fecha: horario.fecha, hora:espacio.espacio}}>
                                    <button
                                        className={espacio.ocupado ? styles.disabled : styles.espacio}
                                        disabled={espacio.ocupado}>
                                        {espacio.espacio}
                                    </button>
                                </Link>
                            ))}

                        </div>
                    </div>
                ))}
            </div>

            <Link to="/horarioExtendido" className={styles["schedule-button"]} state={{horariosFiltrados, medico}}>
                Schedule
                <img src="/images/arrow.png" alt=""/>
            </Link>
        </>
    );
}


export default BuscarCita;