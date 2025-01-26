// src/pages/public/Noticias.jsx
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import PublicationList from '../../components/shared/publications/PublicationList';

const Noticias = () => {
    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <PublicationList 
                    sectionSlug="noticias"
                    pageTitle="Noticias"
                />
            </main>
        </div>
    );
};

export default Noticias;