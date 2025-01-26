import React from 'react';
import { Link } from 'react-router-dom';

const TopBar = () => {
    return (
        <div className="mceee-topbar">
            <div className="mceee-topbar__inner">
                <div className="mceee-topbar__social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                       className="mceee-topbar__social-link" aria-label="Síguenos en Facebook">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                       className="mceee-topbar__social-link" aria-label="Síguenos en Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                       className="mceee-topbar__social-link" aria-label="Síguenos en Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                       className="mceee-topbar__social-link" aria-label="Síguenos en YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                       className="mceee-topbar__social-link" aria-label="Síguenos en LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
                {/* Corregida la estructura del GIESE link */}
                <div>
                    <Link to="/giese" className="mceee-topbar__giese" aria-label="Ir a GIESE">
                        GIESE
                    </Link>
                </div>
                {/* Separado el botón en su propio div */}
                <div className="mceee-topbar__actions">
                    <button className="mceee-topbar__button" aria-label="Ver más información">
                        Ver más
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;