import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  // Fetch user profile and keep in state
  const fetchProfile = async (currentUser?: User) => {
    const u = currentUser || user;
    if (!u) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', u.id)
      .maybeSingle();
    if (error) {
      setProfile(null);
    } else if (data) {
      setProfile({
        full_name: data.full_name ?? null,
        avatar_url: data.avatar_url ?? null,
      });
    } else {
      setProfile(null);
    }
  };
  // Expose manual refresh
  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email_confirmed_at ? 'confirmed' : 'not confirmed');
      
      // Only set session if email is confirmed
      if (session?.user?.email_confirmed_at) {
        setSession(session);
        setUser(session.user);
        checkUserRole(session.user.id);
        fetchProfile(session.user);
      } else {
        // Clear any unconfirmed session
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Email confirmed:', session?.user?.email_confirmed_at);
      
      // Handle different auth events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Only set session for confirmed users
        if (session?.user?.email_confirmed_at) {
          setSession(session);
          setUser(session.user);
          checkUserRole(session.user.id);
          fetchProfile(session.user);
        } else {
          // Clear session for unconfirmed users
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setProfile(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      setIsAdmin(!!data);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Check Your Email",
        description: "We sent you a verification link. Please check your email to complete registration.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
        }
        throw error;
      }

      // Double-check email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      await refreshProfile();
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Goodbye!",
        description: "You have been signed out.",
      });
      setProfile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        profile,
        refreshProfile,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
