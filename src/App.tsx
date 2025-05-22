import React from 'react';
import Dashboard from './views/Dashboard';
import { Routes, Route } from 'react-router-dom'
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import Login from './page/login';
import  Layout  from './components/Layout';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          {/* Nested routes under layout */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<Login />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;