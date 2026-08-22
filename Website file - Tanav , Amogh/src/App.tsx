import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HRDataProvider } from './contexts/HRDataContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './components/AppRoutes';

export function App() {
  return (
    <HRDataProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="h-full w-full bg-canvas font-sans text-ink">
            <AppRoutes />
          </div>
          <Toaster position="bottom-right" richColors closeButton />
        </BrowserRouter>
      </AuthProvider>
    </HRDataProvider>);

}