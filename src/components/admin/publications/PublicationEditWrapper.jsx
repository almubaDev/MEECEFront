// components/admin/publications/PublicationEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { authHeader } from '../../../services/auth';
import PublicationForm from './PublicationForm';

const PublicationEditWrapper = () => {
  const [publication, setPublication] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/publications/${id}/`, {
          headers: authHeader()
        });
        setPublication(response.data);
      } catch (error) {
        console.error('Error fetching publication:', error);
      }
    };
    
    if (id) {
      fetchPublication();
    }
  }, [id]);

  if (!publication) return <div>Cargando...</div>;

  return <PublicationForm publication={publication} isEdit={true} />;
};

export default PublicationEditWrapper;
