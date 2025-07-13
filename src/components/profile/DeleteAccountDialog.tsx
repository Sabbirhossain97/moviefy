
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteAccountDialogProps {
  children: React.ReactNode;
}

export const DeleteAccountDialog = ({ children }: DeleteAccountDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete user data from all tables
      const deletePromises = [
        supabase.from('wishlists').delete().eq('user_id', user.id),
        supabase.from('tv_wishlists').delete().eq('user_id', user.id),
        supabase.from('watched_movies').delete().eq('user_id', user.id),
        supabase.from('watched_tv_series').delete().eq('user_id', user.id),
        supabase.from('favorite_movies').delete().eq('user_id', user.id),
        supabase.from('favorite_tv_series').delete().eq('user_id', user.id),
        supabase.from('movie_ratings').delete().eq('user_id', user.id),
        supabase.from('series_ratings').delete().eq('user_id', user.id),
        supabase.from('movie_reviews').delete().eq('user_id', user.id),
        supabase.from('series_reviews').delete().eq('user_id', user.id),
        supabase.from('movie_reminders').delete().eq('user_id', user.id),
        supabase.from('user_api_keys').delete().eq('user_id', user.id),
        supabase.from('user_roles').delete().eq('user_id', user.id),
      ];

      await Promise.all(deletePromises);

      // Delete the user account (this will also delete the profile due to cascade)
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;

      toast({
        title: 'Account deleted',
        description: 'Your account and all associated data have been permanently deleted.',
      });

      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
            <p className="font-medium">The following data will be permanently deleted:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Profile information</li>
              <li>Movie and TV series wishlists</li>
              <li>Watched lists</li>
              <li>Favorites</li>
              <li>Ratings and reviews</li>
              <li>Reminders</li>
              <li>API keys</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
