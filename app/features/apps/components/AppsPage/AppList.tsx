import { type App } from '@/app/features/apps/types';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface AppListProps {
  apps: App[];
  onToggle: (appId: string, setting: keyof App) => void;
  onEdit: (app: App) => void;
}

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToggleButton = memo(function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'cursor-pointer text-sm font-medium px-2',
        active ? 'text-[#FF0000]' : 'text-gray-500 hover:text-gray-900'
      )}
    >
      {children}
    </span>
  );
});

export const AppList = memo(function AppList({ apps, onToggle, onEdit }: AppListProps) {
  return (
    <div className="divide-y divide-gray-100 rounded-lg overflow-hidden">
      {apps.map(app => (
        <div
          key={app.id}
          className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
            <app.icon className="h-5 w-5 text-[#FF0000]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{app.name}</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <ToggleButton
                active={app.comingSoon}
                onClick={() => onToggle(app.id, 'comingSoon')}
              >
                Soon
              </ToggleButton>
              <ToggleButton
                active={app.showInMore}
                onClick={() => onToggle(app.id, 'showInMore')}
              >
                Hide
              </ToggleButton>
            </div>
            <Pencil 
              className="h-4 w-4 text-gray-500 hover:text-gray-900 cursor-pointer" 
              onClick={() => onEdit(app)}
            />
          </div>
        </div>
      ))}
    </div>
  );
});