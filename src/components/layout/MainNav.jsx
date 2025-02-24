// components/layout/MainNav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
    };

    return (
        <nav className={`mceee-mainnav z-[102] ${window.innerWidth < 1024 ? 'fixed top-0' : ''}`}>
            <div className="mceee-mainnav__container">
                <div className="mceee-mainnav__content">
                    {/* Logo y botón de menú */}
                    <div className="flex items-center justify-between w-full lg:w-auto">
                        <Link to="/" className="mceee-mainnav__logo">
                            <img src="/logoA.jpeg" alt="Logo" />
                        </Link>
                        
                        {/* Botón hamburguesa - visible solo en móvil/tablet */}
                        <button 
                            onClick={toggleMenu}
                            className="lg:hidden p-2 text-[#1a76cf] hover:text-[#8ed1fc]"
                            aria-label="Menú principal"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Menú de navegación */}
                    <div className={`
                        fixed lg:static top-16 lg:top-auto left-0 w-full h-[calc(100vh-64px)] lg:h-auto
                        bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible
                        transition-transform duration-300 ease-in-out
                        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        lg:flex lg:items-center
                    `}>
                        {/* Links de navegación */}
                        <div className="mceee-mainnav__links flex flex-col lg:flex-row space-y-4 lg:space-y-0 p-4 lg:p-0">
                            {/* Social links - visibles solo en móvil */}
                            <div className="flex space-x-4 lg:hidden mb-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#1a76cf]">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#1a76cf]">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#1a76cf]">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#1a76cf]">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#1a76cf]">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </div>

                            {/* GIESE link - visible solo en móvil */}
                            <Link to="/giese" className="lg:hidden text-[#1a76cf] font-medium mb-4">
                                GIESE
                            </Link>

                            {/* Links principales */}
                            <Link to="/" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Inicio
                            </Link>
                            <Link to="/presentacion-magister" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Presentación magíster
                            </Link>
                            <Link to="/cuerpo-docente" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Cuerpo docente
                            </Link>
                            <Link to="/revista" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Revista
                            </Link>
                            <Link to="/congresos" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Congresos
                            </Link>
                            <Link to="/media" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Media
                            </Link>
                            <Link to="/noticias" className="mceee-mainnav__link" onClick={() => setIsMenuOpen(false)}>
                                Noticias
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;