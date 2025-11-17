import {useContext, useEffect} from "react";
import {AppContext} from "../../AppProvider";
import LoginForm from "./LoginForm";
import {FetchRequest} from "../../utils/FetchRequest";

function Login(){
    const {loginState, setLoginState, setAuth} = useContext(AppContext);

    useEffect(() => {}, []);

    function submit(e){
        e.preventDefault();
        handleLogin();
    }

    async function handleLogin() {
        const response = await FetchRequest("/usuarios/login?", {
            method: "POST",
            body: JSON.stringify(loginState)
        }, false);
        if (response) {
            saveToken(response);
            setLoginState({
                id:'',
                password:''
            });
        }
    }

    function saveToken(token){
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.id;
        const nombre = payload.name;
        const rol = payload.scope?.[0] ?? '';

        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        localStorage.setItem('rol', rol);
        localStorage.setItem('nombre', nombre);

        setAuth({
            isAuthenticated: true,
            token,
            user: { id, nombre, rol }
        });
    }

    function handleChange(event){
        const {name, value} = event.target;
        setLoginState(prev => ({ ...prev, [name]: value }));
    }

    return (
        <LoginForm
            entity={loginState}
            submit={submit}
            handleChange={handleChange}
        />
    );
}

export default Login;
