import React from "react";
import logo from '../../img/hospital-pediatrico-sinaloa.png';
import './login.css'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            usuario: 'hola',
            password: 'milo'
        };
    }
    render() {
        //var admin = require("firebase-admin");
        // let serviceAccount = require("./login.json");

        // // Initialize Firebase
        // const app = initializeApp({
        //     credential: admin.credential.cert(serviceAccount)
        // });

        // // Initialize Firebase Authentication and get a reference to the service
        // const auth = getAuth(app);
        // createUserWithEmailAndPassword(auth, this.state.usuario, this.state.password)
        //     .then((userCredential) => {
        //         // Signed in 
        //         const user = userCredential.user;
        //         // ...
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         // ..
        //     });

        return (
            <div className="login-box">
                <img src={logo} className="avatar" alt="avatar hospital pediatrico" />
                <h1>Inicio de sesion</h1>
                <form>

                    <label for="username">Username</label>
                    <input type="text" placeholder="Enter Username" />


                    <label for="password">Password</label>
                    <input type="password" placeholder="Enter Password" />

                    <input type="submit" value="Log In" />

                    <a href="#">Lost your password?</a><br />
                    <a href="#">Don't have an account?</a>
                </form>

            </div>
        );
    }
}

export default Login;