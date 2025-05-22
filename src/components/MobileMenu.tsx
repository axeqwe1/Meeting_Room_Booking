import React from 'react';
import { Calendar, LayoutGrid, Users, Settings, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Menu</h2>
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-md group">
            <Calendar className="h-5 w-5 mr-3 text-blue-500" />
            <span className="font-medium">Calendar</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md group">
            <LayoutGrid className="h-5 w-5 mr-3 text-gray-500" />
            <span>Rooms</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md group">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <span>My Bookings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md">
            <Settings className="h-5 w-5 mr-3 text-gray-500" />
            <span>Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;