import { useAuth } from '@/hooks/useAuth';
import LandingPage from './LandingPage';
import Dashboard from './dashboard/Dashboard';
import { useState, useEffect } from 'react';
import { Video } from "lucide-react";

const Index = () => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authCheckTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    if (session) {
      clearTimeout(authCheckTimer);
      setIsLoading(false);
    }

    return () => clearTimeout(authCheckTimer);
  }, [session]);

  if (isLoading && session === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Video className="h-7 w-7 text-movie-primary transition-transform group-hover:scale-110" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return session ? <Dashboard /> : <LandingPage />;
};

export default Index;

