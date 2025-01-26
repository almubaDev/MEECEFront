import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';

const CuerpoDocente = () => {
    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <div className="mceee-content">
                    <h1 className="mceee-content__title">
                        Cuerpo Docente
                    </h1>
                    <div className="mceee-content__container">
                        {/* Grid de docentes que vendrá del backend */}
                    </div>
                </div>
            </main>
            <footer className="mceee-page__footer">
                <div className="mceee-footer__container">
                    {/* Contenido del footer */}
                </div>
            </footer>
        </div>
    );
};

export default CuerpoDocente;