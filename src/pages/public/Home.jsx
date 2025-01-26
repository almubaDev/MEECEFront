import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import HeroSection from '../../components/layout/HeroSection';

const Home = () => {
    return (
        <div className="mceee-page">
            <div className="mceee-page__header">
                <TopBar />
                <MainNav />
            </div>
            <main className="mceee-page__main">
                <HeroSection />
                <div className="mceee-page__content">
                    {/* Contenido adicional aquí */}
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

export default Home;