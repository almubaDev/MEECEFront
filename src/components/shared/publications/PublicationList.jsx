// src/components/shared/publications/PublicationList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getPublicPublications } from '../../../services/publicApi';

const PublicationList = ({ sectionSlug, pageTitle }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const data = await getPublicPublications(sectionSlug);
                const publicationsData = data.results || data;
                setPublications(Array.isArray(publicationsData) ? publicationsData : []);
            } catch (err) {
                console.error('Error:', err);
                setError(`Error al cargar las publicaciones de ${pageTitle}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPublications();
    }, [sectionSlug, pageTitle]);

    const getFirstParagraph = (layout) => {
        if (!layout || !Array.isArray(layout)) return '';
        
        for (const row of layout) {
            if (!row.cells || !Array.isArray(row.cells)) continue;
            
            for (const cell of row.cells) {
                if (cell.type === 'text') {
                    const text = cell.content.replace(/<[^>]*>/g, '');
                    return text.slice(0, 100) + '...';
                }
            }
        }
        return '';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-gray-600">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-space-grotesk font-bold mb-8">{pageTitle}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {publications.map((publication) => (
                    <Link
                        key={publication.id}
                        to={`/${sectionSlug}/${publication.id}`}
                        className="block group relative"
                    >
                        <article className="bg-white rounded-lg overflow-hidden shadow-sm h-full">
                            {publication.featured_image && (
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={publication.featured_image}
                                        alt={publication.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="p-4">
                                <h2 className="text-lg font-space-grotesk font-bold mb-2 line-clamp-2">
                                    {publication.title}
                                </h2>
                                
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {getFirstParagraph(publication.layout)}
                                </p>
                                
                                <div className="text-gray-500 text-xs">
                                    {new Date(publication.publish_date).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                          transition-opacity duration-300 flex items-center justify-center">
                                <i className="fas fa-arrow-right text-white text-3xl"></i>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
};

PublicationList.propTypes = {
    sectionSlug: PropTypes.string.isRequired,
    pageTitle: PropTypes.string.isRequired
};

export default PublicationList;