import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx'; // Import AuthProvider
import { Toaster } from '@/components/ui/sonner'; // Import Toaster for notifications

createRoot(document.getElementById("root")!).render(
  <BrowserRouter> { /* Wrap App with BrowserRouter for routing */ }
    <AuthProvider> { /* Wrap App with AuthProvider */ }
      <App />
      <Toaster /> { /* Add Toaster for notifications */ }
    </AuthProvider>
  </BrowserRouter>
);

