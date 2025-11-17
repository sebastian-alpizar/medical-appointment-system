import {useEffect, useState} from "react";
import stylesHorario from './HorarioExtendido.module.css';
import stylesBuscarCita from '../buscarCita/BuscarCita.module.css';
import {Link, useLocation} from "react-router-dom";
import RequestImage from "../../components/RequestImage";
import {FetchRequest} from "../../utils/FetchRequest";

function HorarioExtendido() {
    const location = useLocation();
    const datos = location.state;

    const [horarioExtendido, setHorarioExtendido] = useState({
        medico: { nombre: '', id: '', especialidad: '', hospital: '', ubicacion: '' },
        horarios: []
    });

    useEffect(() => {
        if (datos) {
            setHorarioExtendido({
                medico: datos.medico,
                horarios: datos.horariosFiltrados
            });
        }
    }, [datos]);

    const [diasSumados, setDiasSumados] = useState(0);

    async function addDays() {
        const nuevosDias = diasSumados + 7;
        setDiasSumados(nuevosDias);

        const horarios = await FetchRequest(`/horarios/next`, {
            method: 'POST',
            body: JSON.stringify({
                diasSumados: nuevosDias,
                horarios: horarioExtendido.horarios
            }),
        }, false);

        if (horarios){
            setHorarioExtendido(prev => ({
                ...prev,
                horarios: horarios
            }));
            return;
        }
        setDiasSumados(prev => prev - 7);
    }

    async function subtractDays() {
        const nuevosDias = diasSumados - 7;
        setDiasSumados(nuevosDias);

        const horarios = await FetchRequest(`/horarios/prev`, {
            method: 'POST',
            body: JSON.stringify({
                diasSumados: nuevosDias,
                horarios: horarioExtendido.horarios
            }),
        }, false);

        if (horarios){
            setHorarioExtendido(prev => ({
                ...prev,
                horarios: horarios
            }));
            return;
        }
        setDiasSumados(prev => prev + 7);
    }

    return (
        <ExtendSchedule
            entity={horarioExtendido}
            addDays={addDays}
            diasSumados={diasSumados}
            subtractDays={subtractDays}
        />
    );
}

function ExtendSchedule({entity, addDays, subtractDays, diasSumados}){
    return (
        <div className={stylesHorario.body}>
            <div className={stylesHorario["medico-extendido"]}>
                {diasSumados > 0 && (
                    <button onClick={subtractDays} className={stylesHorario["prev-button"]}>
                        <img src="/images/arrow.png" alt=""/>
                        prev
                    </button>
                )}
                <div className={stylesHorario.medico}>
                    <div className={stylesBuscarCita.informacion}>
                        <div className={stylesBuscarCita.detalle}>
                            <RequestImage id={entity.medico.id}/>
                            <div>
                                <div>
                                    <p>{entity.medico.nombre}</p>
                                    <p>{entity.medico.id}</p>
                                </div>
                                <p>{entity.medico.especialidad}</p>
                            </div>
                        </div>
                        <div className={stylesBuscarCita.line}></div>
                        <div>
                            <p>{entity.medico.hospital}</p>
                            <span>@</span>
                            <p>{entity.medico.ubicacion}</p>
                        </div>
                    </div>
                    <FreeFields medico={entity.medico}
                                horarios={entity.horarios}
                    />
                </div>
                <button onClick={addDays} className={stylesHorario["next-button"]}>
                    Next
                    <img src="/images/arrow.png" alt=""/>
                </button>
            </div>
            <div className={stylesHorario.line2}></div>
            <Link to="/">
                <button className={stylesHorario["back-button"]}>
                    Go Back
                </button>
            </Link>
        </div>
    );
}

function FreeFields({medico, horarios}){
    return(
        <>
            <div className={stylesBuscarCita["horarios-container"]}>
                {horarios.map((horario) => (
                    <div key={`${horario.idMedico}-${horario.fecha}`} className={stylesBuscarCita["horario-box"]}>
                        <h3>{horario.fecha}</h3>
                        <div className={stylesBuscarCita.espacios}>
                            {horario.espacios.map((espacio) => (
                                <Link
                                    to="/confirmarCita"
                                    key={`${medico.id}-${horario.fecha}-${espacio.espacio}`}
                                    state={{medico, fecha:horario.fecha, hora:espacio.espacio}}>
                                    <button
                                        className={espacio.ocupado ? stylesBuscarCita.disabled : stylesBuscarCita.espacio}
                                        disabled={espacio.ocupado}>
                                        {espacio.espacio}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default HorarioExtendido;