// src/components/shared/publications/PublicationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getPublicPublication } from '../../../services/publicApi';
import TopBar from '../../layout/TopBar';
import MainNav from '../../layout/MainNav';

const PublicationDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [publication, setPublication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extraer el section_slug del path
    const pathParts = location.pathname.split('/');
    const sectionSlug = pathParts[1];

    useEffect(() => {
        const fetchPublication = async () => {
            try {
                console.log('Fetching publication with ID:', id); // Log 1: ID de publicación
                const data = await getPublicPublication(id);
                console.log('Publication data received:', data); // Log 2: Datos completos recibidos

                // Log específico para featured_image
                if (data.featured_image) {
                    console.log('Featured image URL:', data.featured_image); // Log 3: URL de la imagen
                    // Precargar la imagen
                    const img = new Image();
                    img.onload = () => console.log('Image loaded successfully'); // Log 4: Éxito en carga
                    img.onerror = (e) => console.error('Image failed to load:', e); // Log 5: Error en carga
                    img.src = data.featured_image;
                } else {
                    console.log('No featured image in publication data'); // Log 6: No hay imagen
                }

                setPublication(data);
            } catch (err) {
                console.error('Detailed error:', {
                    message: err.message,
                    response: err.response,
                    stack: err.stack
                }); // Log 7: Error detallado
                setError(err.response?.data?.message || 'Error al cargar la publicación');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPublication();
        }
    }, [id]);

    const renderCell = (cell) => {
        console.log('Rendering cell:', cell); // Log 8: Renderizado de celda
        switch (cell.type) {
            case 'text':
                return (
                    <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: cell.content }}
                    />
                );
            case 'image':
                return (
                    <div className="my-6">
                        <img 
                            src={cell.content} 
                            alt="" 
                            className="w-full h-auto rounded-lg shadow-md"
                            loading="lazy"
                            onError={(e) => {
                                console.error('Cell image failed to load:', cell.content); // Log 9: Error en imagen de celda
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                );
            case 'video':
                const getEmbedUrl = (url) => {
                    console.log('Processing video URL:', url); // Log 10: Procesamiento de URL de video
                    if (!url) return '';
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        const videoId = url.includes('youtube.com/watch?v=') 
                            ? url.split('v=')[1] 
                            : url.split('youtu.be/')[1];
                        return `https://www.youtube.com/embed/${videoId}?rel=0`;
                    }
                    if (url.includes('vimeo.com')) {
                        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
                    }
                    return url;
                };

                return (
                    <div className="my-6">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                src={getEmbedUrl(cell.content)}
                                title="Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                                loading="lazy"
                                onError={(e) => console.error('Video failed to load:', cell.content)} // Log 11: Error en video
                            />
                        </div>
                    </div>
                );
            default:
                console.log('Unknown cell type:', cell.type); // Log 12: Tipo de celda desconocido
                return null;
        }
    };

    if (loading) {
        return (
            <>
                <TopBar />
                <MainNav />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-gray-600">Cargando...</div>
                </div>
            </>
        );
    }

    if (error || !publication) {
        console.error('Error state:', error); // Log 13: Estado de error
        console.log('Publication state:', publication); // Log 14: Estado de publicación en error
        return (
            <>
                <TopBar />
                <MainNav />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-red-600">
                        {error || 'No se encontró la publicación'}
                    </div>
                </div>
            </>
        );
    }

    console.log('Rendering publication:', {
        title: publication.title,
        hasFeaturedImage: !!publication.featured_image,
        hasLayout: !!publication.layout,
        sectionSlug
    }); // Log 15: Información de renderizado

    return (
        <>
            <TopBar />
            <MainNav />
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb navigation */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <nav className="text-sm">
                            <ol className="list-none p-0 inline-flex">
                                <li className="flex items-center">
                                    <Link to="/" className="text-gray-500 hover:text-blue-600">
                                        Inicio
                                    </Link>
                                    <span className="mx-2 text-gray-400">/</span>
                                </li>
                                {sectionSlug && (
                                    <li className="flex items-center">
                                        <Link to={`/${sectionSlug}`} className="text-gray-500 hover:text-blue-600">
                                            {publication.section_title || sectionSlug}
                                        </Link>
                                        <span className="mx-2 text-gray-400">/</span>
                                    </li>
                                )}
                                <li className="text-gray-700 truncate max-w-md">
                                    {publication.title}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Featured Image with error handling */}
                {publication.featured_image && (
                    <div className="w-full bg-gray-900 relative overflow-hidden" style={{ height: '400px' }}>
                        <img 
                            src={publication.featured_image}
                            alt={publication.title}
                            className="w-full h-full object-cover"
                            onLoad={() => console.log('Featured image loaded successfully')} // Log 16: Carga exitosa de imagen destacada
                            onError={(e) => {
                                console.error('Featured image failed to load:', {
                                    src: publication.featured_image,
                                    error: e
                                }); // Log 17: Error en imagen destacada
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Publication date */}
                    <div className="text-sm text-gray-500 mb-4">
                        {new Date(publication.publish_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-space-grotesk font-bold text-gray-900 mb-8">
                        {publication.title}
                    </h1>

                    {/* Main content */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        {publication.layout?.map((row, rowIndex) => {
                            console.log('Rendering row:', row); // Log 18: Renderizado de fila
                            return (
                                <div key={rowIndex} className="grid grid-cols-4 gap-6 mb-6">
                                    {row.cells?.map((cell, cellIndex) => (
                                        <div 
                                            key={cellIndex}
                                            className="relative"
                                            style={{
                                                gridColumn: `span ${cell.columnSpan || 1}`
                                            }}
                                        >
                                            {renderCell(cell)}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicationDetail;