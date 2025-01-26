// components/admin/sections/SectionEditWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { authHeader } from '../../../services/auth';
import SectionForm from './SectionForm';

const SectionEditWrapper = () => {
  const [section, setSection] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/sections/${id}/`, {
          headers: authHeader()
        });
        setSection(response.data);
      } catch (error) {
        console.error('Error fetching section:', error);
      }
    };
    
    if (id) {
      fetchSection();
    }
  }, [id]);

  if (!section) return <div>Cargando...</div>;
  
  return <SectionForm section={section} isEdit={true} />;
};

export default SectionEditWrapper;