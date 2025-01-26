// src/components/admin/publications/grid/GridRow.jsx
import React from 'react';
import GridCell from './GridCell';

const GridRow = ({ row, onUpdate, onDelete }) => {
  const usedColumns = row.cells.reduce((sum, cell) => sum + cell.columnSpan, 0);
  const availableColumns = 4 - usedColumns;

  const handleCellUpdate = (cellIndex, updatedCell) => {
    const otherCellsSpan = row.cells.reduce((sum, cell, idx) => 
      idx !== cellIndex ? sum + cell.columnSpan : sum, 0);
    
    if (otherCellsSpan + updatedCell.columnSpan > 4) {
      alert('El total de columnas no puede exceder 4');
      return;
    }

    const updatedCells = [...row.cells];
    updatedCells[cellIndex] = updatedCell;
    onUpdate({
      ...row,
      cells: updatedCells
    });
  };

  const handleCellDelete = (cellIndex) => {
    const updatedCells = row.cells.filter((_, index) => index !== cellIndex);
    onUpdate({
      ...row,
      cells: updatedCells
    });
  };

  const addCell = () => {
    if (availableColumns <= 0) {
      alert('No hay espacio disponible en esta fila');
      return;
    }

    onUpdate({
      ...row,
      cells: [
        ...row.cells,
        {
          id: `cell_${Date.now()}`,
          type: 'text',
          content: '',
          columnSpan: availableColumns
        }
      ]
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="grid grid-cols-4 gap-4 w-full">
        {row.cells.map((cell, index) => (
          <div 
            key={cell.id} 
            className={`col-span-${cell.columnSpan} w-full`}
            style={{
              gridColumn: `span ${cell.columnSpan}`
            }}
          >
            <GridCell
              cell={cell}
              onChange={(updatedCell) => handleCellUpdate(index, updatedCell)}
              onDelete={() => handleCellDelete(index)}
              availableColumns={availableColumns + cell.columnSpan}
            />
          </div>
        ))}
      </div>
      
      {availableColumns > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={addCell}
            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Celda ({availableColumns} {availableColumns === 1 ? 'columna disponible' : 'columnas disponibles'})
          </button>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-600 hover:text-red-800 flex items-center px-3 py-1 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Eliminar Fila
        </button>
      </div>
    </div>
  );
};

export default GridRow;
