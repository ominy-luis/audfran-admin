import React from "react";
import { AuthProvider } from "../components/login/Auth";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home/Home";
import Login from "../components/login/Login";
import Nav from "../components/template/Nav";
import UserCrud from "../components/user/UserCrud";
import PrivateRoute from "../components/login/PrivateRoute";

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route exact path="" element={<Login />} />
        <Route path="/pacientes" element={<UserCrud />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;
