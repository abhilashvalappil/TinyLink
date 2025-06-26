import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/Api';  
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();
      if (!user) navigate('/login');
      else setLoading(false);
    };
    verify();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
};
