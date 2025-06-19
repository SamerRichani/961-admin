"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type App } from '@/app/features/apps/types';
import { 
  Wallet, Star, ShoppingBag, Sparkles, Droplet, 
  Cloud, Briefcase, TrendingUp, Building,
  Upload, Image,
  type LucideIcon
} from 'lucide-react';

const availableIcons = [
  { icon: Wallet, name: 'Wallet' },
  { icon: Star, name: 'Star' },
  { icon: ShoppingBag, name: 'Shopping Bag' },
  { icon: Sparkles, name: 'Sparkles' },
  { icon: Droplet, name: 'Droplet' },
  { icon: Cloud, name: 'Cloud' },
  { icon: Briefcase, name: 'Briefcase' },
  { icon: TrendingUp, name: 'Trending Up' },
  { icon: Building, name: 'Building' },
];

interface AppFormProps {
  app?: App;
  onSubmit: (data: Partial<App>) => void;
  onCancel: () => void;
}

export function AppForm({ app, onSubmit, onCancel }: AppFormProps) {
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon>(app?.icon || Wallet);
  const [name, setName] = useState(app?.name || '');
  const [description, setDescription] = useState(app?.description || '');
  const [link, setLink] = useState(app?.link || '');
  const [iconTab, setIconTab] = useState('select');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      icon: selectedIcon,
      link,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Icon</Label>
          <Tabs value={iconTab} onValueChange={setIconTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 gap-2">
              <TabsTrigger value="select" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Select Icon
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="select">
              <div className="grid grid-cols-3 gap-2">
                {availableIcons.map(({ icon: Icon, name: iconName }) => (
                  <div
                    key={iconName}
                    onClick={() => setSelectedIcon(Icon)}
                    className={`p-4 rounded-lg cursor-pointer flex items-center justify-center ${
                      Icon === selectedIcon ? 'bg-red-50 ring-2 ring-[#FF0000]' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Upload a custom icon (Coming soon)</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="link">Link URL</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
          {app ? 'Save Changes' : 'Add App'}
        </Button>
      </DialogFooter>
    </form>
  );
}