
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useUserApiKeys = () => {
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApiKey = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching API key:', error);
        return;
      }

      setGeminiApiKey(data?.gemini_api_key || null);
    } catch (error) {
      console.error('Error fetching API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (apiKey: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          gemini_api_key: apiKey,
        });

      if (error) {
        console.error('Error saving API key:', error);
        toast({
          title: "Error",
          description: "Failed to save API key. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setGeminiApiKey(apiKey);
      toast({
        title: "Success!",
        description: "Your Gemini API key has been saved securely.",
      });
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteApiKey = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting API key:', error);
        toast({
          title: "Error",
          description: "Failed to delete API key. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setGeminiApiKey(null);
      toast({
        title: "Success!",
        description: "Your API key has been deleted.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, [user]);

  return {
    geminiApiKey,
    loading,
    saveApiKey,
    deleteApiKey,
    refreshApiKey: fetchApiKey,
  };
};
