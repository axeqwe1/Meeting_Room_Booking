import React, { useEffect, useState } from 'react';
import { Calendar, LayoutGrid, Users, Settings, X ,LogOut} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

    useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-gray-500 opacity-75 z-40" onClick={handleClose}></div>
      <div className={`fixed inset-y-0 z-50 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Menu</h2>
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <button
            onClick={() => handleNavigation('/')}
            className={`w-full flex items-center px-4 py-3 rounded-md ${
              isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className={`h-5 w-5 mr-3 ${isActive('/') ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className={isActive('/') ? 'font-medium' : ''}>Calendar</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/rooms')}
            className={`w-full flex items-center px-4 py-3 rounded-md ${
              isActive('/rooms') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className={`h-5 w-5 mr-3 ${isActive('/rooms') ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className={isActive('/rooms') ? 'font-medium' : ''}>Rooms</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/my-bookings')}
            className={`w-full flex items-center px-4 py-3 rounded-md ${
              isActive('/my-bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className={`h-5 w-5 mr-3 ${isActive('/my-bookings') ? 'text-blue-500' : 'text-gray-500'}`} />
            <span className={isActive('/my-bookings') ? 'font-medium' : ''}>My Bookings</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => handleNavigation('/login')}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            <LogOut className="h-5 w-5 mr-3 text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
    ,document.body)
  );
};

export default MobileMenu;