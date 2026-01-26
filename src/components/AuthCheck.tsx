
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AuthCheckProps {
  children: React.ReactNode;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to access this page",
      });
      navigate('/');
    }
  }, [loading, user, navigate, toast]);

  if (loading) {
    return <div className="min-h-screen bg-banking-darkBg flex items-center justify-center">
      <div className="animate-pulse text-banking-white">Loading...</div>
    </div>;
  }

  return user ? <>{children}</> : null;
};
