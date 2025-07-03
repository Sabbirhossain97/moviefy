
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
import { User, Heart, Crown, LogOut, Settings, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const UserMenu = () => {
  const { user, isAdmin, signOut, profile } = useAuth();

  if (!user) {
    return (
      <AuthDialog>
        <Button variant="outline" size="sm" className='h-10 rounded-full md:rounded-md bg-muted/50 border-muted-foreground/20'>
          <User className="w-4 h-4 lg:mr-2" />
          <span className='hidden md:block'>Sign In</span>
        </Button>
      </AuthDialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center [@media(max-width:768px)]:border-none md:border md:bg-muted/50 md:border-muted-foreground/20 rounded-full sm:rounded-md px-2 h-10 gap-2">
          <Avatar className="w-10 h-10 md:w-7 md:h-7">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden md:block">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-w-xs break-words">
        <div className='py-1.5'>
          <div className="px-2 text-sm font-medium truncate max-w-full" title={user.email}>
            {profile?.full_name}
          </div>
          <div className="px-2 text-gray-400 text-sm font-medium truncate max-w-full" title={user.email}>
            {user.email}
          </div>
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
        <DropdownMenuItem asChild>
          <Link to="/watched" className="cursor-pointer">
            <Eye className="w-4 h-4 mr-2" />
            My Watched List
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
