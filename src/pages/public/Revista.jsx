// src/pages/public/Revista.jsx
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import PublicationList from '../../components/shared/publications/PublicationList';

const Revista = () => {
    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <PublicationList 
                    sectionSlug="revista"
                    pageTitle="Revista"
                />
            </main>
        </div>
    );
};

export default Revista;