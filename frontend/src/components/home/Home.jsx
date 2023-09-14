import React from "react";
import Main from "../template/Main";
import { useAuth, AuthLogin } from "../login/Auth";

const Login = () => {
    if (AuthLogin() == true) {
        console.log("é verdade")
    } else {
        console.log("é mentira")
    }
    return (
        <Main icon="home" title="Dashboard">
            <div className="display-4">Bem Vindo!</div>
            <hr />
            <p className="mb-0">Sistema para exempleficar a construcao de um cadasto em React Js</p>
        </Main>
    )
};

export default Login