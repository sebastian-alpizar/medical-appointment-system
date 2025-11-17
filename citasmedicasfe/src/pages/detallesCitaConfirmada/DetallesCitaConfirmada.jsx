import styles from '../confirmarCita/ConfirmarCita.module.css';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import RequestImage from "../../components/RequestImage";

function DetallesCitaConfirmada(){
    const location = useLocation();
    const cita = location.state;

    const [detallesCitaConfirmadaSate, setDetallesCitaConfirmadaSate] = useState({
        id: '',
        idMedico:'',
        nombre: '',
        fecha: '',
        hora: '',
        hospital: '',
        costoConsulta: ''
    });

    useEffect(() => {
        if (cita) {
            setDetallesCitaConfirmadaSate({
                id: cita.id,
                idMedico: cita.idMedico.id,
                nombre: cita.idMedico.nombre,
                fecha: cita.fecha,
                hora: cita.hora,
                hospital: cita.idMedico.hospital,
                costoConsulta: cita.idMedico.costoConsulta
            });
        }
    }, [cita]);

    return (
        <>
            <AppointmentsDetails cita={detallesCitaConfirmadaSate}/>
        </>
    );
}

function AppointmentsDetails({cita}){
    return (
        <div className={styles.body}>
            <RequestImage id={cita.idMedico} className={styles.perfil}/>
            <div>
                <img src="/images/perfil.png" alt=""/>
                <p>{cita.nombre}</p>
            </div>
            <div>
                <img src="/images/calendar.png" alt=""/>
                <p>{cita.fecha}</p>
                T
                <p>{cita.hora}</p>
            </div>
            <div>
                <img src="/images/ubicacicon.png" alt=""/>
                <p>{cita.hospital}</p>
            </div>
            <div>
                <img src="/images/dollar.png" alt=""/>
                <p>{cita.costoConsulta}</p>
            </div>
        </div>
    );
}
export default DetallesCitaConfirmada;