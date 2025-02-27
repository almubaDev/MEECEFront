// services/publicApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://mceee.pythonanywhere.com';

// Crear una instancia separada de axios para peticiones públicas
const publicAxios = axios.create({
    baseURL: BASE_URL,
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000')
});

// Publicaciones
export const getPublicPublications = async (sectionSlug) => {
    try {
        const response = await publicAxios.get(`/api/public/publications/`, {
            params: { section_slug: sectionSlug }
        });
        console.log('Publications response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching public publications:', error);
        throw error;
    }
};

export const getPublicPublication = async (id) => {
    try {
        const response = await publicAxios.get(`/api/public/publication/${id}/`);
        console.log('Publication detail response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching public publication:', error);
        throw error;
    }
};

// Biografías (para cuerpo docente)
export const getPublicBiographies = async () => {
    try {
        console.log('Fetching biographies from:', `${BASE_URL}/api/public/biographies/`);
        const response = await publicAxios.get('/api/public/biographies/');
        console.log('Biographies response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching public biographies:', {
            message: error.message,
            response: error.response,
            stack: error.stack
        });
        throw error;
    }
};

// Secciones
export const getPublicSections = async () => {
    try {
        const response = await publicAxios.get(`/api/public/sections/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public sections:', error);
        throw error;
    }
};

export default {
    getPublicPublications,
    getPublicPublication,
    getPublicBiographies,
    getPublicSections
};