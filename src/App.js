// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/layout/MainLayout';

// Public pages
import Home from './pages/public/Home';
import PresentacionMagister from './pages/public/PresentacionMagister';
import PresentacionMagisterDetalle from './pages/public/PresentacionMagisterDetalle';
import CuerpoDocente from './pages/public/CuerpoDocente';
import Revista from './pages/public/Revista';
import RevistaDetalle from './pages/public/RevistaDetalle';
import Congresos from './pages/public/Congresos';
import CongresoDetalle from './pages/public/CongresoDetalle';
import Media from './pages/public/media';
import MediaDetalle from './pages/public/MediaDetalle';
import Noticias from './pages/public/Noticias';
import NoticiaDetalle from './pages/public/NoticiaDetalle';

import './styles/public.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          
          {/* Presentación Magister routes */}
          <Route path="/presentacion-magister" element={<PresentacionMagister />} />
          <Route path="/presentacion-del-magister/:id" element={<PresentacionMagisterDetalle />} />

          {/* Cuerpo Docente route */}
          <Route path="/cuerpo-docente" element={<CuerpoDocente />} />
          
          {/* Revista routes */}
          <Route path="/revista" element={<Revista />} />
          <Route path="/revista/:id" element={<RevistaDetalle />} />
          
          {/* Congresos routes */}
          <Route path="/congresos" element={<Congresos />} />
          <Route path="/congresos/:id" element={<CongresoDetalle />} />
          
          {/* Media routes */}
          <Route path="/media" element={<Media />} />
          <Route path="/media/:id" element={<MediaDetalle />} />
          
          {/* Noticias routes */}
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />
          
          {/* Admin routes */}
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