// src/components/admin/publications/PublicationForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authHeader, getCurrentUser } from '../../../services/auth';
import GridLayout from './grid/GridLayout';

const PublicationForm = ({ publication, isEdit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    section_id: '',
    status: 'draft',
    featured_image: null,
    is_featured: false,
    publish_date: '',
    layout: []
  });
  
  const [sections, setSections] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    featured_image: '',
    publish_date: ''
  });

  useEffect(() => {
    fetchSections();
    if (publication) {
      setForm({
        title: publication.title || '',
        section_id: publication.section?.id || '',
        status: publication.status || 'draft',
        is_featured: publication.is_featured || false,
        publish_date: publication.publish_date ? new Date(publication.publish_date).toISOString().split('T')[0] : '',
        layout: publication.layout || []
      });
      if (publication.featured_image) {
        setPreview(publication.featured_image);
      }
    }
  }, [publication]);

  const fetchSections = async () => {
    try {
      const token = getCurrentUser()?.access;
      if (!token) {
        setError('Por favor, inicie sesión nuevamente');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/sections/`, {
        headers: authHeader()
      });
      setSections(response.data.results || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setError('Error al cargar las secciones');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error de validación cuando el campo se modifica
    if (name === 'publish_date') {
      setValidationErrors(prev => ({
        ...prev,
        publish_date: ''
      }));
    }
  };

  const handleLayoutChange = (newLayout) => {
    setForm(prev => ({ ...prev, layout: newLayout }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors(prev => ({
        ...prev,
        featured_image: 'Tipo de archivo no permitido. Use JPG, PNG, GIF o WEBP.'
      }));
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({
        ...prev,
        featured_image: 'La imagen no debe superar los 5MB'
      }));
      return;
    }

    setForm(prev => ({ ...prev, featured_image: file }));
    setPreview(URL.createObjectURL(file));
    setValidationErrors(prev => ({
      ...prev,
      featured_image: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.featured_image && !preview && !isEdit) {
      errors.featured_image = 'La imagen destacada es requerida';
    }
    
    if (!form.publish_date) {
      errors.publish_date = 'La fecha de publicación es requerida';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!validateForm()) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Añadir campos al FormData
      Object.keys(form).forEach(key => {
        if (key === 'featured_image') {
          if (form.featured_image instanceof File) {
            formData.append('featured_image', form.featured_image);
          }
        } else if (key === 'layout') {
          formData.append('layout', JSON.stringify(form.layout));
        } else if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      const config = {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEdit) {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/publications/${publication.id}/`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/publications/`,
          formData,
          config
        );
      }
      
      navigate('/admin/publications');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Detalles del error:', error.response?.data);
      
      let errorMessage = 'Error al guardar la publicación.';
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? 'Editar' : 'Nueva'} Publicación
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete la información de la publicación.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              {/* Título */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* Sección */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Sección
                </label>
                <select
                  name="section_id"
                  value={form.section_id}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Seleccione una sección</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

          {/* Layout */}
          <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Contenido
            </label>
            <GridLayout 
              layout={form.layout.map(row => ({
                ...row,
                cells: row.cells.map(cell => ({
                  ...cell,
                  publicationId: publication?.id
                }))
              }))}
              onChange={handleLayoutChange}
              publicationId={publication?.id}
            />
          </div>

              {/* Imagen Destacada */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen Destacada <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setForm(prev => ({ ...prev, featured_image: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    name="featured_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {validationErrors.featured_image && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.featured_image}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, GIF o WEBP. Máximo 5MB.
                </p>
              </div>

              {/* Opciones adicionales */}
              <div className="col-span-6 sm:col-span-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Destacado
                  </label>
                </div>
              </div>

              {/* Fecha de publicación */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de publicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="publish_date"
                  value={form.publish_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {validationErrors.publish_date && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.publish_date}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/admin/publications')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>
    </form>
  );
};

export default PublicationForm;
