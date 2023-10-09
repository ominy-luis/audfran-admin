import React from "react";
import { AuthProvider } from "../components/login/Auth";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home/Home";
import Login from "../components/login/Login";
import Nav from "../components/template/Nav";
import UserCrud from "../components/user/UserCrud";
import PrivateRoute from "../components/login/PrivateRoute";
import Produtos from "../components/products/Produtos"
import Vendas from "../components/vendas/Vendas"
import Compras from "../components/compras/Compras"
import Fornecedor from "../components/fornecedor/Fornecedor"

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route exact path="" element={<Login />} />
        <Route path="/pacientes" element={<UserCrud />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/fornecedor" element={<Fornecedor />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;
