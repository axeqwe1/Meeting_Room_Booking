import React from 'react';
import { Calendar, LayoutGrid, Users, Settings, PlusCircle, Link,LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';


const Sidebar: React.FC = () => {

  const navigate = useNavigate()
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleRoom = () => {
    navigate('/rooms')
  }
  const handleCalendar = () => {
    navigate('/dashboard')
  }
  const handleMyBookingRoom = () => {
    navigate('/my-booking')
  }
  const handleLogout = () => {
    refAuth.logout
    navigate('/login')
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
          <a
          onClick={(e) => {
            e.preventDefault();
            handleCalendar()
          }} 
          href="#" 
          className={`flex items-center px-4 py-2 rounded-md group ${
            isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-200'
          }`}>
            <Calendar className="h-5 w-5 mr-3 text-blue-500" />
            <span className="font-medium">Calendar</span>
          </a>
          <a 
          onClick={(e) => {
            e.preventDefault();
            handleRoom()
          }} 
          href="#" 
          className={`flex items-center px-4 py-2 rounded-md group ${
              isActive('/rooms') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-200'
          }`}>
            <LayoutGrid className="h-5 w-5 mr-3 text-gray-500" />
            <span>Rooms</span>
          </a>
          <a 
          onClick={(e) => {
            e.preventDefault()
            handleMyBookingRoom()
          }} 
          href="#" 
          className={`flex items-center px-4 py-2 rounded-md group ${
              isActive('/my-bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-200'
          }`}
          >
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <span>My Bookings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <a onClick={(e) => {
            e.preventDefault()
            handleLogout()
            }} href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
            <LogOut className="h-5 w-5 mr-3 text-red-600" />
            <span>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;