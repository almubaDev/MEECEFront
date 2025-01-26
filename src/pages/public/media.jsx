// src/pages/public/media.jsx
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import PublicationList from '../../components/shared/publications/PublicationList';

const Media = () => {
    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <PublicationList 
                    sectionSlug="media"
                    pageTitle="Media"
                />
            </main>
        </div>
    );
};

export default Media;