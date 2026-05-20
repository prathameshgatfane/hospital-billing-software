import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Building2, Server } from 'lucide-react';

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Mapvon</span>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 font-medium transition-colors ${
                location.pathname === '/' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Hospitals</span>
            </button>
            <button
              onClick={() => navigate('/billing-software')}
              className={`flex items-center space-x-2 font-medium transition-colors ${
                location.pathname === '/billing-software' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Server className="w-5 h-5" />
              <span>Billing Software</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
            >
              SubAdmin / Admin Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
