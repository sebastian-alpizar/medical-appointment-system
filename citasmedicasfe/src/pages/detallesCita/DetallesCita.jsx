import { useLocation } from "react-router-dom";
import stylesDetalles from './DetallesCita.module.css';
import {useEffect, useState} from "react";
import RequestImage from "../../components/RequestImage";
import {FetchRequest} from "../../utils/FetchRequest";

function DetallesCita(){
    const location = useLocation();
    const cita = location.state;
    const [detallesCitaSate, setDetallesCitaSate] = useState({
        id:'',
        idPaciente:'',
        nombre: '',
        fecha: '',
        hora: '',
        hospital: '',
        nota:''
    });

    useEffect(() => {
        if (cita) {
            setDetallesCitaSate({
                id: cita.id,
                idPaciente: cita.idPaciente.id,
                nombre: cita.idPaciente.nombre,
                fecha: cita.fecha,
                hora: cita.hora,
                hospital: cita.idMedico.hospital,
                nota: cita.nota ?? ''
            });
        }
    }, [cita]);

    async function addNote() {
        const cita = await FetchRequest(`/citas/addNota/${detallesCitaSate.id}`, {
            method: 'PUT',
            body: JSON.stringify(detallesCitaSate.nota),
        }, true);

        if (cita) {
            setDetallesCitaSate({
                id: cita.id,
                nombre: cita.idPaciente.nombre,
                fecha: cita.fecha,
                hora: cita.hora,
                hospital: cita.idMedico.hospital,
                nota: cita.nota,
            });
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setDetallesCitaSate(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            <AppointmentsDetails entity={detallesCitaSate}
                                 handleChange={handleChange}
                                 addNote={addNote}
            />
        </>
    );
}

function AppointmentsDetails({entity, handleChange, addNote}){
    return (
        <div className={stylesDetalles.body}>
            <RequestImage id={entity.idPaciente} className={stylesDetalles.perfil}/>
            <div>
                <img src="/images/perfil.png" alt=""/>
                <p>{entity.nombre}</p>
            </div>
            <div>
                <img src="/images/calendar.png" alt=""/>
                <p>{entity.fecha}</p>
                T
                <p>{entity.hora}</p>
            </div>
            <div>
                <img src="/images/ubicacicon.png" alt=""/>
                <p>{entity.hospital}</p>
            </div>
            <AddNot entity={entity}
                    handleChange={handleChange}
                    addNote={addNote}
            />
        </div>
    );
}

function AddNot({entity, handleChange, addNote}){
    return (
        <div className={stylesDetalles.form}>
            <input type="hidden" name="id" value={entity.id}/>
            <textarea
                id="nota"
                name="nota"
                onChange={handleChange}
                placeholder="Agregar nueva nota"
                value={entity.nota}
                required
            />
            <button type="button" onClick={addNote}>Anotar</button>
        </div>
    );
}

export default DetallesCita;