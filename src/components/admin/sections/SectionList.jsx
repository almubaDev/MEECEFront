// components/admin/sections/SectionList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { authHeader } from '../../../services/auth';

const SortableTableRow = ({ section, onDelete, onEdit, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td {...attributes} {...listeners} className="px-6 py-4 whitespace-nowrap cursor-move">
        <div className="text-sm font-medium text-gray-900">{section.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          section.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {section.is_active ? 'Visible' : 'No visible'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(section.id);
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
              onEdit(section.id);
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
              onDelete(section.id);
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

const SectionList = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sections/', {
        headers: authHeader()
      });
      setSections(response.data.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sección?')) {
      try {
        await axios.delete(`http://localhost:8000/api/sections/${id}/`, {
          headers: authHeader()
        });
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        const orderUpdate = newOrder.map((item, index) => ({
          id: item.id,
          order: index
        }));
        
        axios.patch(
          'http://localhost:8000/api/sections/reorder/',
          orderUpdate,
          { headers: authHeader() }
        ).catch(error => {
          console.error('Error updating order:', error);
          fetchSections();
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
        <h2 className="text-2xl font-bold text-gray-900">Secciones</h2>
        <button
          onClick={() => navigate('/admin/sections/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nueva Sección
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <SortableContext 
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section) => (
                  <SortableTableRow
                    key={section.id}
                    section={section}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/admin/sections/edit/${id}`)}
                    onView={(id) => navigate(`/admin/sections/${id}`)}
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

export default SectionList;