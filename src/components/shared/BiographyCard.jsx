// src/components/shared/BiographyCard.jsx
import React, { useState } from 'react';

const BiographyCard = ({ biography }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;

  // Verificar que biography existe
  if (!biography) {
    console.warn('BiographyCard: Received undefined biography');
    return null;
  }

  // Log para depuración
  console.log('Rendering biography card:', biography);

  const truncatedBiography = biography.biography?.length > maxLength 
    ? `${biography.biography.substring(0, maxLength)}...` 
    : biography.biography || '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4" 
         style={{ borderLeftColor: '#1a76cf' }}>
      <div className="grid grid-cols-12 gap-4">
        {/* Columna de la foto - 5 columnas */}
        <div className="col-span-5 relative">
          <div className="aspect-[4/5] relative max-h-[240px]">
            {biography.photo ? (
              <img
                src={biography.photo}
                alt={biography.name || ''}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  console.error('Failed to load image:', biography.photo);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=Photo';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-3xl text-gray-400">
                  {biography.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90">
              <div className="p-2 flex flex-col space-y-1">
                {biography.email && (
                  <a
                    href={`mailto:${biography.email}`}
                    className="text-[#0070da] hover:text-[#1a76cf] flex items-center text-xs group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="truncate">{biography.email}</span>
                  </a>
                )}
                
                {biography.linkedin && (
                  <a
                    href={biography.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0070da] hover:text-[#1a76cf] flex items-center text-xs group"
                  >
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna de información - 7 columnas */}
        <div className="col-span-7 p-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {biography.name || 'Sin nombre'}
            </h3>
            <p className="text-[#1a76cf] font-medium mb-3 text-sm">
              {biography.position || 'Sin cargo'}
            </p>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 text-sm">
                {isExpanded ? biography.biography : truncatedBiography}
              </p>
              {biography.biography?.length > maxLength && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#0070da] hover:text-[#1a76cf] text-sm font-medium mt-2 focus:outline-none"
                >
                  {isExpanded ? 'Leer menos' : 'Leer más'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiographyCard;