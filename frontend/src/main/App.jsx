import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './App.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../components/login/Auth'
// import { useAuth, AuthLogin } from "../components/login/Auth";

import Routes from './Routes'

import Logo from '../components/template/Logo'
import Nav from '../components/template/Nav'
import Footer from '../components/template/Footer'


// if (AuthLogin() == true) {
//   console.log("é verdade")
// } else {
//   console.log("é mentira")
// }
export default props =>
  <AuthProvider>
    <BrowserRouter>
      <div className="app">
        <Logo />
        <Nav />
        <Routes />
        <Footer />
      </div>
    </BrowserRouter>
  </AuthProvider>
