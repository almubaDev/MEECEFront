// src/components/admin/publications/grid/GridCell.jsx
import React, { useState } from 'react';
import RichEditor from '../../../shared/RichEditor';
import { authHeader } from '../../../../services/auth';
import axios from 'axios';

const GridCell = ({ cell, onChange, onDelete, availableColumns = 4 }) => {
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
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=1&modestbranding=1`;
        }
      }
      
      // Vimeo
      if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}?autoplay=0&controls=1`;
        }
      }
      
      return url;
    } catch (error) {
      console.error('Error processing video URL:', error);
      return '';
    }
  };

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewVideo, setPreviewVideo] = useState(() => {
    if (cell.type === 'video' && cell.content) {
      const embedUrl = getEmbedUrl(cell.content);
      console.log('Initializing video preview with:', embedUrl);
      return embedUrl;
    }
    return null;
  });

  const handleTypeChange = (newType) => {
    onChange({
      ...cell,
      type: newType,
      content: ''
    });
    setPreviewVideo(null);
  };

  const handleContentChange = (newContent) => {
    onChange({
      ...cell,
      content: newContent
    });

    if (cell.type === 'video') {
      const embedUrl = getEmbedUrl(newContent);
      console.log('Setting video preview with:', embedUrl);
      setPreviewVideo(embedUrl);
    }
  };

  const handleSpanChange = (span) => {
    onChange({
      ...cell,
      columnSpan: parseInt(span)
    });
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const API_BASE_URL = 'http://localhost:8000';
      let response;

      // Si tenemos ID de publicación, usamos el endpoint específico
      if (cell.publicationId) {
        response = await axios.post(
          `${API_BASE_URL}/api/publications/${cell.publicationId}/upload_cell_image/`,
          formData,
          {
            headers: {
              ...authHeader(),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Si no hay ID (nueva publicación), usamos el endpoint general de upload
        response = await axios.post(
          `${API_BASE_URL}/api/upload-image/`,
          formData,
          {
            headers: {
              ...authHeader(),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data && response.data.url) {
        // Asegurarse de que la URL sea absoluta
        const imageUrl = response.data.url.startsWith('http') 
          ? response.data.url 
          : `${API_BASE_URL}${response.data.url}`;
        handleContentChange(imageUrl);
      } else {
        throw new Error('URL de imagen no válida en la respuesta');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const renderEditor = () => {
    switch (cell.type) {
      case 'text':
        return (
          <div className="editor-container" style={{ width: '100%', minHeight: '100px' }}>
            <RichEditor
              value={cell.content}
              onChange={handleContentChange}
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4 w-full">
            {cell.content && (
              <div className="relative w-full">
                <img 
                  src={cell.content} 
                  alt="" 
                  className="w-full h-auto rounded"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-gray-500">Subiendo imagen...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4 w-full">
            <input
              type="text"
              value={cell.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="URL del video (YouTube o Vimeo)"
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-sm text-gray-500">
              Ejemplo: https://www.youtube.com/watch?v=XXXX o https://vimeo.com/XXXX
            </p>
            {previewVideo && (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={previewVideo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  title="Video Preview"
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="border p-4 rounded-lg bg-white shadow w-full"
      style={{ gridColumn: `span ${cell.columnSpan}` }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <select
            value={cell.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="text">Texto</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
          </select>
          <select
            value={cell.columnSpan}
            onChange={(e) => handleSpanChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {[...Array(availableColumns)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'columna' : 'columnas'}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
          title="Eliminar celda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="w-full">
        {renderEditor()}
      </div>
    </div>
  );
};

export default GridCell;
