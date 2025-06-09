import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import  Layout  from './components/Layout';
import { AlertProvider } from './context/AlertContext';
import { RoomProvider } from './context/RoomContext';
import {SettingProvider} from './context/SettingContext'

function App() {
  const Dashboard = lazy(() => import('./page/Dashboard'));
  const Login = lazy(() => import('./page/login'));
  const RoomManagement = lazy(() => import('./page/RoomManagement'));
  const Settings = lazy(() => import('./page/Settings'));
  const RoomAvaliable = lazy(() => import('./page/RoomAvaliable'))
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
                    <Route path="roomavaliable" element={<RoomAvaliable/>} />
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