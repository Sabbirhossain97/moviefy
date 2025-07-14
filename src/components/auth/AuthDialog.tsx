
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  children: React.ReactNode;
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const AuthDialog = ({ children }: AuthDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(signInData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(signInData.password)) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      setOpen(false);
      setSignInData({ email: '', password: '' });
    } catch (error: any) {
      if (error.message?.includes('Email not confirmed')) {
        toast({
          title: 'Email Not Verified',
          description: 'Please check your email and click the verification link before signing in.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(signUpData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address (e.g., user@example.com).',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(signUpData.password)) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (!signUpData.fullName.trim()) {
      toast({
        title: 'Missing Name',
        description: 'Please enter your full name.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signUpData.fullName,
          },
        },
      });

      if (error) throw error;

      // Set the pending email and show verification screen
      setPendingEmail(signUpData.email);
      setShowEmailVerification(true);
      setSignUpData({ email: '', password: '', fullName: '' });
      
      console.log('Signup successful, showing verification screen for:', signUpData.email);
      
      toast({
        title: 'Check Your Email',
        description: 'We sent you a verification link. Please check your email and click the link to complete registration.',
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(forgotPasswordEmail)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const siteUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;

      toast({
        title: 'Verification Email Sent',
        description: 'We sent another verification email to your inbox.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAllStates = () => {
    setShowEmailVerification(false);
    setShowForgotPassword(false);
    setPendingEmail('');
    setSignInData({ email: '', password: '' });
    setSignUpData({ email: '', password: '', fullName: '' });
    setForgotPasswordEmail('');
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset all states when dialog closes
      resetAllStates();
    }
  };

  if (showEmailVerification) {
    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-movie-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-muted-foreground">
                We sent a verification link to:
              </p>
              <p className="font-medium text-movie-primary">{pendingEmail}</p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to complete your registration.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowEmailVerification(false);
                  setPendingEmail('');
                }}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showForgotPassword) {
    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
              >
                Back
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                  >
                    {showSignInPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signUpData.fullName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    placeholder="At least 6 characters"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
