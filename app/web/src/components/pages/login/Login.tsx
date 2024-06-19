import React, {useState} from 'react';
import 'components/pages/login/Login.css';
import {Form, useActionData} from 'react-router-dom';

interface ErrorMessages {
    message: string;
}

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useActionData() as ErrorMessages;

    return (
        <>
            <header className="login-header">
                <img
                    src="https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png"
                    alt="IMT Atlantique Logo"/>
                <h3>Welcome to Alumni FIL</h3>
                <p>Login to access administrative features</p>
            </header>

            <div className="main-content">
                <div className="login-container">
                    <Form method="post" id="login-form" action="/login">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error?.message && <small className="danger">{error.message}</small>}
                        <button type="submit" className="btn btn-custom btn-block">Login</button>
                    </Form>
                </div>
            </div>

            <footer className="login-footer">
                <a href="#">Contact Us</a> | <a href="#">Privacy Policy</a>
            </footer>
        </>
    );
}

export default Login;
