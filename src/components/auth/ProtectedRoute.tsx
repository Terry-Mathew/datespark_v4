import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
}

const ProtectedRoute = ({ children, requiresPremium = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (requiresPremium && !user.isPremium) {
    return <Navigate to="/pricing" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 