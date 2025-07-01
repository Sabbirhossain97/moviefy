
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Key, Trash2, Eye, EyeOff } from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApiKeyModal = ({ open, onOpenChange }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { geminiApiKey, saveApiKey, deleteApiKey } = useUserApiKeys();

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    
    setSaving(true);
    const success = await saveApiKey(apiKey.trim());
    if (success) {
      setApiKey('');
      onOpenChange(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const success = await deleteApiKey();
    if (success) {
      setApiKey('');
    }
    setDeleting(false);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gemini API Key
          </DialogTitle>
          <DialogDescription>
            Enter your personal Gemini API key to use AI search features. Your key is stored securely and only you can access it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {geminiApiKey ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      API Key Configured
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                      {showApiKey ? geminiApiKey : maskApiKey(geminiApiKey)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-api-key">Update API Key</Label>
                <Input
                  id="new-api-key"
                  type="password"
                  placeholder="Enter new API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || !apiKey.trim()}
                  className="flex-1"
                >
                  {saving ? 'Updating...' : 'Update Key'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  size="icon"
                >
                  {deleting ? '...' : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handleSave}
                disabled={saving || !apiKey.trim()}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save API Key'}
              </Button>
            </div>
          )}
          
          <div className="border-t pt-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://aistudio.google.com/apikey', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get API Key from Google AI Studio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
