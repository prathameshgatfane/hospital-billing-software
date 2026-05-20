import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Adjust path based on your structure

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleMyAccount = () => {
    setShowDropdown(false);
    navigate('/subadmin');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Mapvon</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-red-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-red-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-red-600 transition-colors">Testimonials</a>
            <a href="#about" className="text-gray-600 hover:text-red-600 transition-colors">About</a>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Logged In State
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email || 'User'}
                      </p>
                      {user?.registrationStage && (
                        <p className="text-xs text-gray-500 mt-1">
                          {user.registrationStage === 'BASIC' ? 'Basic Account' : 'Complete Account'}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={handleMyAccount}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In State
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:block px-6 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;