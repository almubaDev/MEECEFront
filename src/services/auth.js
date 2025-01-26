// services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password
    });
    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      throw { message: 'Usuario o contraseña incorrectos' };
    }
    throw { message: 'Error al iniciar sesión. Por favor, intente nuevamente.' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user && user.access ? true : false;
};

export const authHeader = () => {
  const user = getCurrentUser();
  if (user?.access) {
    return { 
      'Authorization': `Bearer ${user.access}`,
      'Accept': 'application/json'
    };
  }
  return {};
};

export const authHeaderMultipart = () => {
  const user = getCurrentUser();
  if (user?.access) {
    return { 
      'Authorization': `Bearer ${user.access}`,
      'Accept': 'application/json'
    };
  }
  return {};
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No intentar refresh token para rutas públicas
    if (originalRequest.url.includes('/public/')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('token/refresh/')
    ) {
      originalRequest._retry = true;
      
      try {
        const user = getCurrentUser();
        if (!user?.refresh) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: user.refresh
        });

        const { access } = response.data;
        
        user.access = access;
        localStorage.setItem('user', JSON.stringify(user));

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access}`
        };
        
        return axios(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error);
    }

    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
    // Ignorar autenticación para rutas públicas
    if (config.url.includes('/public/') || config.url.includes('/token/')) {
      return config;
    }

    if (config.data instanceof FormData) {
      config.headers = {
        ...config.headers,
        ...authHeaderMultipart()
      };
    } else {
      config.headers = {
        ...config.headers,
        ...authHeader()
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  authHeader,
  authHeaderMultipart
};