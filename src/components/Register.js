import { useState } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const { signup } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState();

    const handleChange = ({ target: { name, value } }) => {
        setUser({ ...user, [name]: value })
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signup(user.email, user.password);
            navigate('/')
        } catch (error) {
            setError(error.message);
            alert(error.message);
        }
    };

    return (
        <div id="register">
            <div id="formulariologin" className="border border-dark rounded bg-white">
                <form onSubmit={handleSubmit} className="px-4 py-3">
                    <div className="mb-3">
                        <p className="display-6 text-center">Registro de Usuario</p>
                    </div>
                    <div className="mb-3">
                        <label for="exampleDropdownFormEmail1" className="form-label">Correo Electronico</label>
                        <input type="email" name="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">Contraseña</label>
                        <input type="password" name="password" className="form-control" id="password" placeholder="*******" onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary">Registrarse</button>
                </form>
            </div>
        </div>
    )
}