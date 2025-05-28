import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

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