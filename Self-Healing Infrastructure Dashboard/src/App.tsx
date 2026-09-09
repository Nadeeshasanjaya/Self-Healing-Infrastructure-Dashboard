import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SystemProvider } from './contexts/SystemContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Infrastructure } from './pages/Infrastructure';
import { Services } from './pages/Services';
import { Containers } from './pages/Containers';
import { Monitoring } from './pages/Monitoring';
import { SelfHealing } from './pages/SelfHealing';
import { Alerts } from './pages/Alerts';
import { Deployments } from './pages/Deployments';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <SystemProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/services" element={<Services />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/self-healing" element={<SelfHealing />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SystemProvider>);

}