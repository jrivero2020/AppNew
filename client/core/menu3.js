import React from "react";
import logo from './../assets/images/LogoColegio.png'
import './../assets/css/myStyle.css'

const Menu3 = () => (
  <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
  <div className="container">
    <a className="navbar-brand logo ms-1">
      <img src={logo} alt="" />Los Conquistadores
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse scrollSuave" id="navbarNav">
      <div className="mx-auto"></div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#inicio">Inicio</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#quienesSomos">Quienes Somos</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#destacados">Destacados</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#contacto">Contacto</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

)

export default Menu3;
