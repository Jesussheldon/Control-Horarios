import { useState } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate()
    const [error, setError] = useState();

    const handleChange = ({ target: { name, value } }) => {
        setUser({ ...user, [name]: value })
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(user.email, user.password);
            navigate('/')
        } catch (error) {
            setError(error.message);
            alert(error.message);
        }
    };

    const handleGoogleSignin = async () => {
        await loginWithGoogle();
        navigate('/')
    }

    return (
        <div id="login">

            <div id="formulariologin" className="border border-dark rounded bg-white">
                <form onSubmit={handleSubmit} className="px-4 py-3">
                    <div className="mb-3">
                        <p className="display-6 text-center">Inicio de Sesion</p>
                    </div>
                    <div className="mb-3">
                        <label for="exampleDropdownFormEmail1" className="form-label">Correo Electronico</label>
                        <input type="email" name="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">Contraseña</label>
                        <input type="password" name="password" className="form-control" id="password" placeholder="*******" onChange={handleChange}/>
                    </div>

                    <button type="submit" className="btn btn-primary">Iniciar sesion</button>
                    <button type="button" className="btn btn-success float-end" onClick={handleGoogleSignin}>Google Login</button>
                    <hr/>
                    <a className="text-primary d-block" href="/register">Registrate</a>
                </form>
            </div>

        </div>

    );
}