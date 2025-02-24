// src/components/admin/publications/PublicationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authHeader } from '../../../services/auth';

const PublicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/publications/${id}/`,
          { headers: authHeader() }
        );
        console.log('Publication data:', response.data);
        setPublication(response.data);
      } catch (error) {
        console.error('Error fetching publication:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublication();
  }, [id]);

  const renderCell = (cell) => {
    console.log('Rendering cell:', cell);
    switch (cell.type) {
      case 'text':
        return (
          <div 
            className="prose max-w-none break-words"
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              padding: '0 1.5rem'  // Añadido padding horizontal
            }}
            dangerouslySetInnerHTML={{ __html: cell.content }}
          />
        );
      case 'image':
        return (
          <div className="w-full h-full">
            <img 
              src={cell.content} 
              alt="" 
              className="w-full rounded-lg shadow-md"
            />
          </div>
        );
      case 'video':
        const getEmbedUrl = (url) => {
          if (!url) return '';
          
          try {
            // YouTube
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
              let videoId = '';
              if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1];
              } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1];
              }
              videoId = videoId?.split('&')[0] || '';
              
              if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&modestbranding=1&playsinline=1`;
              }
            }
            
            // Vimeo
            if (url.includes('vimeo.com')) {
              const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
              
              if (videoId) {
                return `https://player.vimeo.com/video/${videoId}?transparent=0&playsinline=1&autopause=0`;
              }
            }
            
            return url;
          } catch (error) {
            console.error('Error processing video URL:', error);
            return '';
          }
        };

        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getEmbedUrl(cell.content)}
              frameBorder="0"
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Video"
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!publication) return <div>No se encontró la publicación</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">
            {publication.title}
          </h3>
          <button
            onClick={() => navigate(`/admin/publications/edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Editar
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5">
          {/* Información de la publicación */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <span className="text-sm font-medium text-gray-500">Sección</span>
              <p className="mt-1 text-sm text-gray-900">{publication.section?.title}</p>
            </div>
            <div className="col-span-1">
              <span className="text-sm font-medium text-gray-500">Estado</span>
              <p className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  publication.status === 'published' ? 'bg-green-100 text-green-800' : 
                  publication.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {publication.status === 'published' ? 'Publicado' : 
                  publication.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
              </p>
            </div>
            <div className="col-span-1">
              <span className="text-sm font-medium text-gray-500">Fecha de Publicación</span>
              <p className="mt-1 text-sm text-gray-900">
                {publication.publish_date ? new Date(publication.publish_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Sin fecha'}
              </p>
            </div>
          </div>

          {/* Contenido en Grid */}
          <div className="space-y-12">
            {publication.layout?.map((row, rowIndex) => (
              <div 
                key={row.id || rowIndex}
                className="grid grid-cols-4 gap-6"
              >
                {row.cells?.map((cell, cellIndex) => (
                  <div 
                    key={cell.id || cellIndex}
                    className="relative p-4 rounded-lg"
                    style={{
                      gridColumn: `span ${cell.columnSpan || 1}`,
                      minHeight: cell.type === 'image' ? '300px' : 'auto',
                      width: '100%',
                      overflow: 'visible'  // Cambiado de 'hidden' a 'visible'
                    }}
                  >
                    <div className="h-full w-full">
                      {renderCell(cell)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;