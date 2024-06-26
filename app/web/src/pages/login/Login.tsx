import React, {useEffect, useState} from 'react';
import 'pages/login/Login.css';
import {Spin} from 'antd';
import {Form, useActionData, useLoaderData} from 'react-router-dom';

interface ErrorMessages {
    message: string;
}

interface LoaderData {
    username: string;
}

/**
 * Renders a login page with a form, loading spinner, and error messages as needed.
 */
function Login() {
    // State variables
    const loaderData = useLoaderData() as LoaderData;
    const [username, setUsername] = useState(loaderData.username);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const error = useActionData() as ErrorMessages;

    // Reset loading state on error change
    useEffect(() => {
        setLoading(false);
    }, [error]);

    // Form submission handler
    const handleSubmit = () => {
        setLoading(true);
    };

    return (
        <>
            <header className="login-header">
                <img
                    src="https://www.imt-atlantique.fr/sites/default/files/Images/Ecole/charte-graphique/IMT_Atlantique_logo_RVB_Negatif_Baseline_400x272.png"
                    alt="IMT Atlantique Logo"
                />
                <h3>Welcome to Alumni FIL</h3>
                <p>Login to access administrative features</p>
            </header>

            <div className="main-content">
                <div className="login-container">
                    <Form method="post" id="login-form" action="/login" onSubmit={handleSubmit}>
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
                        {loading ? (
                            <Spin data-testid="loading"/>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-custom btn-block"
                                disabled={loading}
                            >
                                Login
                            </button>
                        )}
                    </Form>
                </div>
            </div>

            <footer className="login-footer">
                <p>© 2024 Alumni FIL</p>
            </footer>
        </>
    );
}

export default Login;