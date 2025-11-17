import {createContext, useState} from 'react';

export const AppContext = createContext();

function AppProvider(props){
    const [auth, setAuth] = useState(() => {
        const id = localStorage.getItem('id');
        const nombre = localStorage.getItem('nombre');
        const rol = localStorage.getItem('rol');
        const token = localStorage.getItem('token');

        return id && nombre && rol && token
            ? {
                isAuthenticated: true,
                token: token,
                user: { id, nombre, rol }
            }
            : {
                isAuthenticated: false,
                token: '',
                user: { id: '', nombre: '', rol: '' }
            };
    });

    const [buscarCitaState, setBuscarCitaState] = useState({
        medicos: [],
        horarios: [],
        medico:{especialidad:'', ubicacion:''}
    });

    const [confirmarCitaState, setConfirmarCitaState] = useState({
        medico:{idMedico:'', nombre:'', ubicacion:'', hospital:''},
        cita:{horario:'', hora:''}
    });

    const [gestionCitaState, setGestionCitaState] = useState({
        citas: [],
        busqueda: {status:'ALL', paciente:''}
    });

    const [historicoCitaState, setHistoricoCitaState] = useState({
        citas: [],
        busqueda: {status:'ALL', medico:''}
    });

    const [registroState, setRegistroState] = useState({
        password: '',
        rol:'PACIENTE',
        nombre: '',
        photo: null,
        id: ''
    });

    const [perfilMedicoState, setPerfilMedicoState] = useState({
        password: '',
        rol:'',
        photo: null,
        ubicacion:'',
        hospital:'',
        dias: [],
        horaInicio:'',
        horaFin:'',
        especialidad:'',
        costo:'',
        frecuencia:'',
    });

    const [loginState, setLoginState] = useState({
        id:'',
        password:''
    });

    const resetAppStates = () => {
        setBuscarCitaState({
            medicos: [],
            horarios: [],
            medico: { especialidad: '', ubicacion: '' }
        });

        setGestionCitaState({
            citas: [],
            busqueda: { status: 'ALL', paciente: '' }
        });

        setHistoricoCitaState({
            citas: [],
            busqueda: { status: 'ALL', medico: '' }
        });

        setAuth({
            isAuthenticated: false,
            token: '',
            user: { id: '', nombre: '', rol: '' }
        });
    };

    return (
        <AppContext.Provider value={{
            auth: auth, setAuth: setAuth,
            buscarCitaState: buscarCitaState, setBuscarCitaState: setBuscarCitaState,
            confirmarCitaState: confirmarCitaState, setConfirmarCitaState: setConfirmarCitaState,
            gestionCitaState: gestionCitaState, setGestionCitaState: setGestionCitaState,
            historicoCitaState: historicoCitaState, setHistoricoCitaState: setHistoricoCitaState,
            registroState: registroState, setRegistroState: setRegistroState,
            perfilMedicoState: perfilMedicoState, setPerfilMedicoState: setPerfilMedicoState,
            loginState: loginState, setLoginState: setLoginState,
            resetAppStates
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppProvider;