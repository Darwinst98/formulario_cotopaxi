import React from 'react';
import { Link } from 'react-router-dom';
import LogoCotopaxi from '../imagenes/cotopaxi_inicio.jpg'; // Importa la imagen
import '../styles/navbar.css';

const Navbar = () => {
    return (
        <div className="mt-2 mb-4 ml-2"> {/* Agrega márgenes a la parte superior, inferior y izquierda */}
            <nav className="navbar navbar-expand-lg navbar-light">
                <Link to='/' className="navbar-brand">
                    {/* Contenedor para la imagen y el texto */}
                    <div className="d-flex align-items-center"> {/* Alinea verticalmente los elementos */}
                        {/* Imagen */}
                        <img src={LogoCotopaxi} width='100' alt="Logo Cotopaxi" className="mr-2" /> {/* Agrega margen derecho */}
                        {/* Título */}
                        <span className="logo-title font-weight-bold">Volcán Cotopaxi</span>
                    </div>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav"> {/* Justifica los elementos al centro */}
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item active">
                            <Link className="nav-link font-weight-bold text-white" to='/'>Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link font-weight-bold text-white" to='/formulario'>Formulario</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
