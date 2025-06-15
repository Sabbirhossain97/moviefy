
import { useAuth } from '@/hooks/useAuth';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { useState, useEffect } from 'react';

const Index = () => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This logic prevents a "flicker" from the landing page to the dashboard on load
    // for authenticated users. We'll show a brief loader while Supabase checks the session.
    const authCheckTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // If the session is loaded before the timer, clear the timer and hide the loader.
    if (session) {
      clearTimeout(authCheckTimer);
      setIsLoading(false);
    }

    return () => clearTimeout(authCheckTimer);
  }, [session]);

  // While checking auth, show a loader. But if the session is loaded, don't show the loader.
  if (isLoading && session === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return session ? <Dashboard /> : <LandingPage />;
};

export default Index;

