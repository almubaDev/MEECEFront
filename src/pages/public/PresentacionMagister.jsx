// src/pages/public/PresentacionMagister.jsx
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import PublicationList from '../../components/shared/publications/PublicationList';

const PresentacionMagister = () => {
    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <PublicationList 
                    sectionSlug="presentacion-magister"
                    pageTitle="Presentación del Magíster"
                />
            </main>
        </div>
    );
};

export default PresentacionMagister;