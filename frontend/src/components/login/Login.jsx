import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate para acessar o objeto de navegação
import "../login/Login.css";
import { useAuth, AuthLogin } from "../login/Auth";

const Login = () => {
    const navigate = useNavigate(); // Use o useNavigate para acessar a navegação
    const { login } = useAuth();

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        const storedUsername = "admin";
        const storedPassword = "1370";

        if (user === storedUsername && password === storedPassword) {
            alert("Login efetuado com sucesso!");
            login();
            navigate("/dashboard");
        } else {
            alert("Credenciais inválidas. Tente novamente.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input
                        type="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleLogin}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
