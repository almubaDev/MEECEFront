// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/layout/MainLayout';

// Public pages
import Home from './pages/public/Home';
import PresentacionMagister from './pages/public/PresentacionMagister';
import CuerpoDocente from './pages/public/CuerpoDocente';
import Revista from './pages/public/Revista';
import Congresos from './pages/public/Congresos';
import Media from './pages/public/media';
import Noticias from './pages/public/Noticias';
import PublicationDetail from './components/shared/publications/PublicationDetail';

import './styles/public.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/presentacion-magister" element={<PresentacionMagister />} />
          <Route path="/cuerpo-docente" element={<CuerpoDocente />} />
          <Route path="/revista" element={<Revista />} />
          <Route path="/revista/:id" element={<PublicationDetail />} />
          <Route path="/congresos" element={<Congresos />} />
          <Route path="/congresos/:id" element={<PublicationDetail />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/:id" element={<PublicationDetail />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<PublicationDetail />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;