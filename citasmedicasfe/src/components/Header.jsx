import {Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../AppProvider";
import RequestImage from "./RequestImage";

function Header(){
    const {auth, resetAppStates} = useContext(AppContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
        localStorage.removeItem('id');
        resetAppStates();
        navigate("/");
    }

    return(
        <header>
            <div className="left">
                <img src="/images/medical.jpg" alt=""/>
                Medical Appoitments
            </div>
            <div className="center">
                <img src="/images/phone.svg" alt=""/>
                +506 5467 0937
            </div>

            <div className="right">
                <Link to="/about"  className="button">
                    About...
                </Link>

                {(!auth.isAuthenticated || auth.user.rol === 'PACIENTE') && (
                    <Link to="/" className="button">Search</Link>
                )}

                {!auth.isAuthenticated ? (
                    <Link to="/login" className="button">Login</Link>
                ) : (
                    <>
                        {auth.user.rol === 'ADMIN' && (
                            <Link to="/medicosEspera" className="button">Aprobar médicos</Link>
                        )}
                        {auth.user.rol === 'MEDICO' && (
                            <Link to="/gestionCitas" className="button">Mis Citas</Link>
                        )}
                        {auth.user.rol === 'PACIENTE' && (
                            <Link to="/historicoCitas" className="button">Histórico</Link>
                        )}
                        <div className="dropdown">
                            <RequestImage id={auth.user.id} className="img"/>
                            <ul>
                                {auth.user.rol === 'MEDICO' && (
                                    <li><Link to="/perfilMedico" className="dropbtn">Perfil</Link></li>
                                )}
                                <li><button onClick={logout} className="dropbtn">Logout</button></li>
                            </ul>
                        </div>
                    </>
                )}

            </div>
        </header>
    );
}
export default Header;