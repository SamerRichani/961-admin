import { type App } from '@/app/features/apps/types';
import { Card } from '@/components/ui/card';
import { MoreHorizontal, Megaphone } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function AppCard({ app, onDragStart, onDragOver, onDragEnd }: AppCardProps) {
  const navigate = useNavigation();

  const handleClick = () => {
    if (app.link?.startsWith('/')) {
      navigate.navigate(app.link);
    }
  };

  return (
    <Card
      className={cn(
        "p-4 flex flex-col items-center gap-2 cursor-pointer border-0 shadow-none",
        "hover:bg-gray-50 transition-colors"
      )}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <app.icon className="h-6 w-6 text-[#FF0000]" />
      </div>
      <span className={cn(
        "text-sm font-medium text-center",
        app.link?.startsWith('/') && "text-[#FF0000] hover:text-[#CC0000]"
      )}>{app.name}</span>
    </Card>
  );
}

interface MobileAppsProps {
  apps: App[];
  moreApps: App[];
  viewMode: 'mobile' | 'web';
  onDragStart: (app: App) => void;
  onDragOver: (e: React.DragEvent, app: App) => void;
  onDragEnd: () => void;
  onUpdateApp?: (app: App, updates: Partial<App>) => void;
}

function MobileApps({ apps, moreApps, viewMode, onDragStart, onDragOver, onDragEnd, onUpdateApp }: MobileAppsProps) {
  // First 8 apps for the main grid (excluding Advertiser and More)
  const mainApps = apps.slice(0, 8);

  const handleDragStart = (app: App, fromMore: boolean) => {
    onDragStart(app);
    // Store whether the app is from the "More" section
    app.showInMore = fromMore;
  };

  const handleDragOver = (e: React.DragEvent, targetApp: App) => {
    e.preventDefault();
    onDragOver(e, targetApp);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };
  
  return (
    <div className="space-y-8 w-full">
      <div className={cn(
        'grid gap-4 w-full',
        viewMode === 'mobile' ? 'grid-cols-5' : 'grid-cols-10'
      )}>
        {/* First row: 4 apps + Advertiser */}
        {mainApps.slice(0, 4).map(app => (
          <AppCard
            key={app.id}
            app={app}
            onDragStart={() => handleDragStart(app, false)}
            onDragOver={(e) => handleDragOver(e, app)}
            onDragEnd={handleDragEnd}
          />
        ))}
        
        {/* Advertiser slot */}
        <Card className="p-4 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed border-0 shadow-none">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-sm font-medium text-center text-gray-400">Advertiser</span>
        </Card>

        {/* Second row: 4 apps + More */}
        {mainApps.slice(4, 8).map(app => (
          <AppCard
            key={app.id}
            app={app}
            onDragStart={() => handleDragStart(app, false)}
            onDragOver={(e) => handleDragOver(e, app)}
            onDragEnd={handleDragEnd}
          />
        ))}

        {/* More slot */}
        <Card className="p-4 flex flex-col items-center gap-2 border-0 shadow-none">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <MoreHorizontal className="h-6 w-6 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-center">More</span>
        </Card>
      </div>

      {/* More apps section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">More apps</h3>
        <div className={cn(
          'grid gap-4 w-full',
          viewMode === 'mobile' ? 'grid-cols-5' : 'grid-cols-10'
        )}>
          {moreApps.map(app => (
            <AppCard
              key={app.id}
              app={app}
              onDragStart={() => handleDragStart(app, true)}
              onDragOver={(e) => handleDragOver(e, app)}
              onDragEnd={handleDragEnd}
            />
          ))}
          {moreApps.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
              <p className="text-sm">No apps in More section</p>
              <p className="text-xs mt-1">Drag apps here to add them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { MobileApps }