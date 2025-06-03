import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useRoomContext } from '../context/RoomContext';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {loading} = useRoomContext()

  if(loading){
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="loading loading-spinner loading-lg text-primary" />
        <span className="text-gray-600 text-lg animate-pulse">Loading...</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet context={{ collapsed }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;