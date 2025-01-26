// components/admin/publications/PublicationPreview.jsx
import React from 'react';

const PublicationPreview = ({ content, title, featured_image }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Vista Previa</h2>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* Featured Image */}
        {featured_image && (
          <div className="mb-6">
            <img
              src={typeof featured_image === 'string' ? featured_image : URL.createObjectURL(featured_image)}
              alt={title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default PublicationPreview;