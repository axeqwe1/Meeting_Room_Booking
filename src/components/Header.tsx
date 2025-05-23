import React from 'react';
import { Calendar, User, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <Calendar className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">RoomBooker</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline-block">John Doe</span>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;