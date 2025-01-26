// components/admin/publications/PublicationList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { authHeader } from '../../../services/auth';

const SortableTableRow = ({ publication, onDelete, onEdit, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: publication.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td {...attributes} {...listeners} className="px-6 py-4 whitespace-nowrap cursor-move">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {publication.featured_image ? (
              <img 
                className="h-10 w-10 rounded object-cover" 
                src={publication.featured_image}
                alt="" 
              />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No img</span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
        <div className="text-sm font-medium text-gray-900">
          {publication.title}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{publication.section?.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          publication.status === 'published' ? 'bg-green-100 text-green-800' : 
          publication.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {publication.status === 'published' ? 'Publicado' : 
           publication.status === 'draft' ? 'Borrador' : 'Archivado'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {publication.publish_date ? new Date(publication.publish_date).toLocaleDateString() : 'No publicado'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          publication.is_featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {publication.is_featured ? 'Destacado' : 'Normal'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(publication.id);
            }} 
            className="text-blue-600 hover:text-blue-900" 
            title="Ver"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(publication.id);
            }} 
            className="text-indigo-600 hover:text-indigo-900" 
            title="Editar"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(publication.id);
            }}
            className="text-red-600 hover:text-red-900" 
            title="Eliminar"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const PublicationList = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSections();
    fetchPublications();
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sections/', {
        headers: authHeader()
      });
      setSections(response.data.results || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchPublications = async () => {
    try {
      const url = selectedSection 
        ? `http://localhost:8000/api/publications/?section=${selectedSection}`
        : 'http://localhost:8000/api/publications/';
      
      const response = await axios.get(url, {
        headers: authHeader()
      });
      setPublications(response.data.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setPublications([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await axios.delete(`http://localhost:8000/api/publications/${id}/`, {
          headers: authHeader()
        });
        fetchPublications();
      } catch (error) {
        console.error('Error deleting publication:', error);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setPublications((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        const orderUpdate = newOrder.map((item, index) => ({
          id: item.id,
          order: index
        }));
        
        axios.patch(
          'http://localhost:8000/api/publications/reorder/',
          orderUpdate,
          { headers: authHeader() }
        ).catch(error => {
          console.error('Error updating order:', error);
          fetchPublications();
        });

        return newOrder;
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Publicaciones</h2>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todas las secciones</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => navigate('/admin/publications/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nueva Publicación
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white shadow  rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sección
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destacado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <SortableContext 
                items={publications.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {publications.map((publication) => (
                  <SortableTableRow
                    key={publication.id}
                    publication={publication}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/admin/publications/edit/${id}`)}
                    onView={(id) => navigate(`/admin/publications/${id}`)}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </DndContext>
    </div>
  );
};

export default PublicationList;