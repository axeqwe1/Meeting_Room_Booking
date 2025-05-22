import React from 'react';
import { Calendar, LayoutGrid, Users, Settings, PlusCircle, Link } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Sidebar: React.FC = () => {

  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/rooms')
  }

  const refAuth = useAuth()
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <PlusCircle className="h-5 w-5 mr-2" />
            <span>New Booking</span>
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-md group">
            <Calendar className="h-5 w-5 mr-3 text-blue-500" />
            <span className="font-medium">Calendar</span>
          </a>
          <a onClick={handleLogin} href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md group">
            <LayoutGrid className="h-5 w-5 mr-3 text-gray-500" />
            <span>Rooms</span>
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md group">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <span>My Bookings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <a onClick={refAuth.logout} href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
            <Settings className="h-5 w-5 mr-3 text-gray-500" />
            <span>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;