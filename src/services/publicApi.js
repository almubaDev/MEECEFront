// services/publicApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api/public`;

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
        return response.data;
    } catch (error) {
        console.error('Error fetching public publications:', error);
        throw error;
    }
};

export const getPublicPublication = async (id) => {
    try {
        const response = await publicAxios.get(`/api/public/publication/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public publication:', error);
        throw error;
    }
};

// Biografías (para cuerpo docente)
export const getPublicBiographies = async () => {
    try {
        const response = await publicAxios.get(`/api/public/biographies/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public biographies:', error);
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
