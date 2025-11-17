import styles from './ConfirmarCita.module.css';
import {AppContext} from "../../AppProvider";
import {useEffect, useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import RequestImage from "../../components/RequestImage";
import {FetchRequest} from "../../utils/FetchRequest";

function ConfirmarCita(){
    const {confirmarCitaState, setConfirmarCitaState, setBuscarCitaState, auth} = useContext(AppContext);
    const location = useLocation();
    const cita = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        if(cita){
            setConfirmarCitaState({
                medico:{
                    idMedico: cita.medico.id,
                    nombre: cita.medico.nombre,
                    ubicacion: cita.medico.ubicacion,
                    hospital: cita.medico.hospital
                },
                cita: {
                    hora: cita.hora,
                    horario: cita.fecha
                }
            });
        }
    }, [cita, setConfirmarCitaState]);

    async function save() {
        if (!auth.isAuthenticated) navigate("/login");
        const success = await guardarCita();
        if (success) {
            actualizarHorariosOcupados();
            navigate("/");
            alert("Cita guardada con exito!.");
        }
    }

    async function guardarCita() {
        const params = new URLSearchParams({
            idMedico: confirmarCitaState.medico.idMedico,
            fecha: confirmarCitaState.cita.horario,
            hora: confirmarCitaState.cita.hora,
        });

        const response = await FetchRequest('/citas/save?' + params.toString(), {
            method: 'POST'}
        );

        return !(response === false || !response);
    }

    function actualizarHorariosOcupados() {
        setBuscarCitaState(prev => {
            const nuevosHorarios = prev.horarios.map(horario => {
                if (
                    horario.idMedico === confirmarCitaState.medico.idMedico &&
                    horario.fecha === confirmarCitaState.cita.horario
                ) {
                    return {
                        ...horario,
                        espacios: horario.espacios.map(e =>
                            e.espacio === confirmarCitaState.cita.hora
                                ? { ...e, ocupado: true }
                                : e
                        )
                    };
                }
                return horario;
            });

            return {
                ...prev,
                horarios: nuevosHorarios
            };
        });
    }

    return(
        <Show cita={confirmarCitaState.cita}
              medico={confirmarCitaState.medico}
              save={save}
        />
    );

}

function Show({cita, medico, save}){
    return (
        <div className={styles.body}>
            <RequestImage id={medico.idMedico} className={styles.perfil}/>
            <div>
                <img src="/images/perfil.png" alt=""/>
                <p>{medico.nombre}</p>
            </div>
            <div>
                <img src="/images/calendar.png" alt=""/>
                <p>{cita.horario}</p>
                T
                <p>{cita.hora}</p>
            </div>
            <div>
                <img src="/images/ubicacicon.png" alt=""/>
                <p>{medico.hospital}</p>
            </div>
            <div>
                <button onClick={save}>
                    Confirm
                </button>
                <Link to="/">
                    <button>
                        Cancel
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default ConfirmarCita;