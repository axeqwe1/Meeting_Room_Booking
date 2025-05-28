import React, { Suspense, lazy } from 'react';
import Dashboard from './page/Dashboard';
import { Routes, Route } from 'react-router-dom'
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import Login from './page/login';
import  Layout  from './components/Layout';
import RoomManagement from './page/RoomManagement';
import { AlertProvider } from './context/AlertContext';
import { RoomProvider } from './context/RoomContext';
import  Settings from './page/Settings';
import {SettingProvider} from './context/SettingContext'

function App() {
  const Dashboard = lazy(() => import('./page/Dashboard'));
  const Login = lazy(() => import('./page/login'));
  const RoomManagement = lazy(() => import('./page/RoomManagement'));
  const Settings = lazy(() => import('./page/Settings'));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <SettingProvider>
          <RoomProvider>
            <AlertProvider>
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
                    {/* <Route index element={<Dashboard />} /> */}
                    <Route index element={<Dashboard />} /> {/* หน้า default ที่ "/" */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="rooms" element={<RoomManagement />} />
                    <Route path="settings" element={<Settings />} />
                    {/* <Route path="profile" element={<Profile />} /> */}
                </Route>
              </Routes>
            </AlertProvider>
          </RoomProvider>
        </SettingProvider>
      </AuthProvider>
    </Suspense>

  );
}

export default App;