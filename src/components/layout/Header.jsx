import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 font-space-grotesk">
                Panel de Control
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-lato">
              {user?.username}
            </span>
            <button
              onClick={onLogout}
              className=" btn-primary bg-red-600 hover:bg-red-700 text-white p-2 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;