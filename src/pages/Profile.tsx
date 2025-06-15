
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthDialog } from '@/components/AuthDialog';

const BUCKET = "avatars"; // For Supabase storage

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (file: File) => {
    if (!user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let avatar_url = profile.avatar_url;
      if (avatarFile) {
        avatar_url = await uploadAvatar(avatarFile);
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url,
        }).eq('id', user.id);
      if (error) throw error;
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setAvatarFile(null);
      setProfile(prev => ({ ...prev, avatar_url }));
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

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to view and edit your profile
            </p>
            <AuthDialog>
              <Button size="lg">Sign In</Button>
            </AuthDialog>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                        asChild
                      >
                        <span>
                          <Camera className="w-4 h-4" />
                        </span>
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setAvatarFile(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    {/* No avatar URL input here */}
                    {avatarFile && (
                      <div className="text-xs text-muted-foreground">
                        Selected: {avatarFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile(prev => ({ ...prev, full_name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
