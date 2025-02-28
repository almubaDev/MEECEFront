// src/pages/public/CuerpoDocente.jsx
import React, { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import MainNav from '../../components/layout/MainNav';
import BiographyCard from '../../components/shared/BiographyCard';
import { getPublicBiographies } from '../../services/publicApi';

const CuerpoDocente = () => {
    const [biographies, setBiographies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBiographies = async () => {
            try {
                console.log('Fetching biographies...');
                const data = await getPublicBiographies();
                console.log('Raw biography data:', data);

                // Manejar diferentes formatos de respuesta
                let results = [];
                if (data.results && Array.isArray(data.results)) {
                    results = data.results;
                } else if (Array.isArray(data)) {
                    results = data;
                }

                console.log('Processed biographies:', results);
                
                // Filtrar y ordenar biographies
                const activeBiographies = results
                    .filter(bio => bio && bio.is_active !== false) // Incluir si is_active es true o no está definido
                    .sort((a, b) => (a?.order || 0) - (b?.order || 0));
                
                console.log('Active biographies:', activeBiographies);
                setBiographies(activeBiographies);
            } catch (err) {
                console.error('Error details:', err);
                setError('Ocurrió un error al cargar el cuerpo docente.');
            } finally {
                setLoading(false);
            }
        };

        fetchBiographies();
    }, []);

    if (loading) {
        return (
            <div className="mceee-page">
                <TopBar />
                <MainNav />
                <main className="mceee-page__main content_fix">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-gray-600">Cargando...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mceee-page">
                <TopBar />
                <MainNav />
                <main className="mceee-page__main content_fix">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-red-600">{error}</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="mceee-page">
            <TopBar />
            <MainNav />
            <main className="mceee-page__main content_fix">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Cuerpo Docente
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Conoce a nuestro destacado equipo de académicos del Magíster en Educación Emocional y Convivencia Escolar.
                        </p>
                    </div>

                    {biographies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {biographies.map((biography) => (
                                <BiographyCard 
                                    key={biography?.id || Math.random()} 
                                    biography={biography}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            No hay biografías disponibles en este momento.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CuerpoDocente;