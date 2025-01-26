// components/admin/biographies/BiographyList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { authHeader } from '../../../services/auth';

const SortableTableRow = ({ biography, onDelete, onEdit, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: biography.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td {...attributes} {...listeners} className="px-6 py-4 whitespace-nowrap cursor-move">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {biography.photo ? (
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={biography.photo}
                alt={biography.name} 
              />
            ) : (
              <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {biography.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{biography.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{biography.position}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{biography.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          biography.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {biography.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(biography.id);
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
              onEdit(biography.id);
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
              onDelete(biography.id);
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
const BiographyList = () => {
  const navigate = useNavigate();
  const [biographies, setBiographies] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBiographies();
  }, []);

  const fetchBiographies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/biographies/', {
        headers: authHeader()
      });
      console.log('API Response:', response.data); // Para debug
      setBiographies(response.data.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching biographies:', error);
      setBiographies([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta biografía?')) {
      try {
        await axios.delete(`http://localhost:8000/api/biographies/${id}/`, {
          headers: authHeader()
        });
        fetchBiographies();
      } catch (error) {
        console.error('Error deleting biography:', error);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setBiographies((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Actualizar orden en el backend
        const orderUpdate = newOrder.map((item, index) => ({
          id: item.id,
          order: index
        }));
        
        axios.patch(
          'http://localhost:8000/api/biographies/reorder/',
          orderUpdate,
          { headers: authHeader() }
        ).catch(error => {
          console.error('Error updating order:', error);
          fetchBiographies();
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
        <h2 className="text-2xl font-bold text-gray-900">Biografías</h2>
        <button
          onClick={() => navigate('/admin/biographies/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nueva Biografía
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <SortableContext 
                items={biographies.map(b => b.id)} 
                strategy={verticalListSortingStrategy}
              >
                {biographies.map((biography) => (
                  <SortableTableRow
                    key={biography.id}
                    biography={biography}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/admin/biographies/edit/${id}`)}
                    onView={(id) => navigate(`/admin/biographies/${id}`)}
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

export default BiographyList;