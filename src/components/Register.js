import { useState } from "react";
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export function Register() {
    const [user,setUser] = useState({
        email:"",
        password:"",
    });
    const { signup }= useAuth() 
    const navigate = useNavigate()
    const [error, setError] = useState();

    const handleChange = ({target: {name,value}}) =>{
        setUser({...user, [name]: value})
    };
    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            await signup(user.email, user.password);
            navigate('/')
        } catch (error) {
          setError(error.message);  
        }       
    };

    return (
      <div>

        {error && <p> {error}</p>}

        <form onSubmit={handleSubmit}>
            <label htmlFor="email" >Email</label>
            <input 
                type="text" 
                name="email" 
                placeholder="youremail@company.ltd"
                onChange={handleChange}
            />

            <label htmlFor="password" >Passsword</label>
            <input 
                type="password" 
                name="password" 
                id="password"
                onChange={handleChange}
            />
            <button>Register</button>
        </form>
      </div>  
    )
  }