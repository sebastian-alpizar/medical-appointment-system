import {useEffect, useState} from "react";
import stylesEspera from './MedicosEspera.module.css';
import stylesBuscar from "../buscarCita/BuscarCita.module.css";
import RequestImage from '../../components/RequestImage';
import {FetchRequest} from '../../utils/FetchRequest';
import styles from "../buscarCita/BuscarCita.module.css";

function MedicosEspera(){
    const [medicosEspera, setMedicosEspera] = useState({
        nombre: '',
        id: '',
        medicos: [],
    });

    useEffect(() => {
        list();
    }, []);

    async function acceptDoctor(id) {
        const response = await FetchRequest(`/medicos/accept?id=${id}`, { method: 'POST' });
        if (response !== null) {
            await list();
        }
    }

    async function rejectDoctor(id) {
        const response = await FetchRequest(`/medicos/delete?id=${id}`, { method: 'POST' });
        if (response !== null) {
            await list();
        }
    }

    async function list() {
        const data = await FetchRequest(`/medicos/espera`);
        if (data !== null) {
            setMedicosEspera(prev => ({
                ...prev,
                medicos: data
            }));
        }
    }

    return (
        <DoctorList
            medicos={medicosEspera.medicos}
            acceptDoctor={acceptDoctor}
            rejectDoctor={rejectDoctor}
        />
    );
}

function DoctorList({medicos, acceptDoctor, rejectDoctor}){
    if (!medicos || medicos.length === 0) {
        return (
            <div className={stylesEspera.notFound}>
                <p>There are no requests for doctors.</p>
            </div>
        );
    }

    return (
        <div className={stylesEspera.body}>
            {medicos.map((medico) => (
                <div className={stylesEspera.medico} key={medico.id}>
                    <div className={stylesBuscar.informacion}>
                        <div className={stylesBuscar.detalle}>
                            <RequestImage id={medico.id}/>
                            <div>
                                <div>
                                    <p>{medico.nombre}</p>
                                    <p>{medico.id}</p>
                                </div>
                                <p>{medico.especialidad}</p>
                            </div>
                        </div>
                        <div className={stylesBuscar.line}></div>
                        <div>
                            <p>{medico.hospital}</p>
                            <span>@</span>
                            <p>{medico.ubicacion}</p>
                        </div>
                    </div>
                    <div className={stylesEspera.buttons}>
                        <button className={stylesEspera["aceptar-button"]} onClick={()=>acceptDoctor(medico.id)}>
                            Aceptar
                        </button>
                        <button className={stylesEspera["rechazar-button"]} onClick={()=>rejectDoctor(medico.id)}>
                            Rechazar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default MedicosEspera;