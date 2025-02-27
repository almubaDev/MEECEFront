// components/admin/biographies/BiographyEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { authHeader } from '../../../services/auth';
import BiographyForm from './BiographyForm';

const BiographyEditWrapper = () => {
  const [biography, setBiography] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBiography = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/biographies/${id}/`, {
          headers: authHeader()
        });
        setBiography(response.data);
      } catch (error) {
        console.error('Error fetching biography:', error);
      }
    };
    
    if (id) {
      fetchBiography();
    }
  }, [id]);

  if (!biography) return <div>Cargando...</div>;
  
  return <BiographyForm biography={biography} isEdit={true} />;
};

export default BiographyEditWrapper;
