// src/components/admin/publications/grid/GridLayout.jsx
import React from 'react';
import GridRow from './GridRow';

const GridLayout = ({ layout, onChange, publicationId }) => {
  const handleRowUpdate = (rowIndex, updatedRow) => {
    const updatedLayout = [...layout];
    updatedLayout[rowIndex] = updatedRow;
    onChange(updatedLayout);
  };

  const handleRowDelete = (rowIndex) => {
    const updatedLayout = layout.filter((_, index) => index !== rowIndex);
    onChange(updatedLayout);
  };

  const addRow = (e) => {
    // Prevenir cualquier propagación del evento
    e.preventDefault();
    e.stopPropagation();
    
    onChange([
      ...layout,
      {
        id: `row_${Date.now()}`,
        cells: [
          {
            id: `cell_${Date.now()}`,
            type: 'text',
            content: '',
            columnSpan: 4, // Nueva fila ocupa todo el ancho por defecto
            publicationId // Añadir el ID de la publicación
          }
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        {layout.map((row, index) => (
          <GridRow
            key={row.id}
            row={row}
            publicationId={publicationId}
            onUpdate={(updatedRow) => handleRowUpdate(index, updatedRow)}
            onDelete={() => handleRowDelete(index)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button" // Especificar explícitamente que es un botón tipo button
          onClick={addRow}
          className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Agregar Nueva Fila
        </button>
      </div>

      {/* Guía visual de la cuadrícula */}
      <div className="grid grid-cols-4 gap-4 border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm"
          >
            Columna {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridLayout;
