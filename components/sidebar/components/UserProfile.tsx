import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface UserProfileProps {
  name: string;
  avatarUrl: string;
  avatarFallback: string;
  onLogout?: () => void;
}

export function UserProfile({ name, avatarUrl, avatarFallback, onLogout }: UserProfileProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{name}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8 p-0"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 text-[#FF0000] hover:text-red-700" />
      </Button>
    </div>
  );
}