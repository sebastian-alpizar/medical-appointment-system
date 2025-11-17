import './App.css';
import {useContext, useEffect} from "react";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import {AppContext} from "./AppProvider";

import Footer from "./components/Footer";
import Header from "./components/Header"
import BuscarCita from "./pages/buscarCita/BuscarCita";
import ConfirmarCita from "./pages/confirmarCita/ConfirmarCita";
import GestionCitas from "./pages/gestionCitas/GestionCitas";
import HistoricoCitas from "./pages/historicoCitas/HistoricoCitas";
import Registro from "./pages/registro/Registro";
import Login from "./pages/login/Login"
import PerfilMedico from "./pages/perfilMedico/PerfilMedico";
import DetallesCitaConfirmada from "./pages/detallesCitaConfirmada/DetallesCitaConfirmada";
import HorarioExtendido from "./pages/horarioExtendido/HorarioExtendido"
import About from "./pages/about/About";
import MedicosEspera from "./pages/medicosEspera/MedicosEspera";
import DetallesCita from "./pages/detallesCita/DetallesCita";

function App() {
    return (
        <BrowserRouter>
            <AuthRedirect/>
            <div className="App">
                <Header/>
                <Main/>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}

function Main() {
    return (
        <div className={"App-main"}>
            <Routes>
                <Route path="/confirmarCita" element={<ConfirmarCita/>}/>
                <Route path="/" element={<BuscarCita/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Registro/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/citas/ver" element={<DetallesCita/>}/>
                <Route path="/citas/citaPaciente" element={<DetallesCitaConfirmada/>}/>
                <Route path="/horarioExtendido" element={<HorarioExtendido/>}/>
                <Route path="/gestionCitas" element={<GestionCitas/>}/>
                <Route path="/medicosEspera" element={<MedicosEspera/>}/>
                <Route path="/historicoCitas" element={<HistoricoCitas/>}/>
                <Route path="/perfilMedico" element={<PerfilMedico/>}/>
            </Routes>
        </div>
    );
}

function AuthRedirect() {
    const { auth } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            switch (auth.user.rol) {
                case "PACIENTE":
                    navigate("/historicoCitas");
                    break;
                case "MEDICO":
                    navigate("/gestionCitas");
                    break;
                case "ADMIN":
                    navigate("/medicosEspera");
                    break;
                default:
                    navigate("/login");
            }
        }
    }, [auth.isAuthenticated, auth.user.rol]);

    return null; // No renderiza nada, solo maneja la redirección
}

export default App;