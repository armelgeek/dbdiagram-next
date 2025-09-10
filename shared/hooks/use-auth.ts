import { useState, useEffect } from 'react';

interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  token?: string;
}

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
};