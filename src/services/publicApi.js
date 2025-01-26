// services/publicApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const API_URL = `${BASE_URL}/api/public`;

// Publicaciones
export const getPublicPublications = async (sectionSlug) => {
    try {
        const response = await axios.get(`${API_URL}/publications/`, {
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
        const response = await axios.get(`${API_URL}/publication/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public publication:', error);
        throw error;
    }
};

// Biografías (para cuerpo docente)
export const getPublicBiographies = async () => {
    try {
        const response = await axios.get(`${API_URL}/biographies/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public biographies:', error);
        throw error;
    }
};

// Secciones
export const getPublicSections = async () => {
    try {
        const response = await axios.get(`${API_URL}/sections/`);
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