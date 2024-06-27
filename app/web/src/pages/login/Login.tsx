import React, { useContext, useEffect, useState } from 'react';
import 'pages/login/Login.css';
import { Spin } from 'antd';
import { Form, Navigate, useActionData } from 'react-router-dom';
import Footer from "components/Footer";
import { AuthContext } from 'context/AuthContext';

interface LoginResponse {
    message: string;
    accessToken?: string;
    refreshToken?: string;
}

interface LoaderData {
    username: string;
}

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const response = useActionData() as LoginResponse;
    const { isAuthenticated,login } = useContext(AuthContext);

    useEffect(() => {
        setLoading(false);
        if (response?.accessToken && response?.refreshToken) {
            login(response.accessToken, response.refreshToken);
        }
    }, [response, login]);

    const handleSubmit = () => {
        setLoading(true);
    };

    if (isAuthenticated) {
        return <Navigate replace to="/search"/>;
    }

    return (
        <>
            <header className="login-header">
                <img
                    src="https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png"
                    alt="IMT Atlantique Logo"
                />
                <h3>Bienvenue sur Alumni FIL</h3>
                <p>Connectez-vous pour accéder aux fonctionnalités administratives</p>
            </header>

            <div className="main-content">
                <div className="login-container">
                    <Form method="post" id="login-form" action="/login" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                placeholder="Entrez votre nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {response?.message && <small className="danger">{response.message}</small>}
                        {loading ? (
                            <Spin data-testid="loading"/>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-custom btn-block"
                                disabled={loading}
                            >
                                Connexion
                            </button>
                        )}
                    </Form>
                </div>
            </div>

            <Footer/>
        </>
    );
}

export default Login;