
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { User, Heart, Crown, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserMenu = () => {
  const { user, isAdmin, signOut } = useAuth();

  if (!user) {
    return (
      <AuthDialog>
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </AuthDialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-w-xs break-words">
        <div className="px-2 py-1.5 text-sm font-medium truncate max-w-full" title={user.email}>
          {user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/wishlist" className="cursor-pointer">
            <Heart className="w-4 h-4 mr-2" />
            My Wishlist
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <Crown className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
