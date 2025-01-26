import React from 'react';
import { Link } from 'react-router-dom';

const MainNav = () => {
    return (
        <nav className="mceee-mainnav">
            <div className="mceee-mainnav__container">
                <div className="mceee-mainnav__content">
                    <Link to="/" className="mceee-mainnav__logo">
                        <img src="/logoA.jpeg" alt="Logo" />
                    </Link>
                    <div className="mceee-mainnav__links">
                        <Link to="/" className="mceee-mainnav__link">
                            Inicio
                        </Link>
                        <Link to="/presentacion-magister" className="mceee-mainnav__link">
                            Presentación magíster
                        </Link>
                        <Link to="/cuerpo-docente" className="mceee-mainnav__link">
                            Cuerpo docente
                        </Link>
                        <Link to="/revista" className="mceee-mainnav__link">
                            Revista
                        </Link>
                        <Link to="/congresos" className="mceee-mainnav__link">
                            Congresos
                        </Link>
                        <Link to="/media" className="mceee-mainnav__link">
                            Media
                        </Link>
                        <Link to="/noticias" className="mceee-mainnav__link">
                            Noticias
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;