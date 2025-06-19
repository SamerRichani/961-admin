import { type App } from '@/app/features/apps/types';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { memo } from 'react';

interface ReorderListProps {
  apps: App[];
  onDragStart: (app: App) => void;
  onDragOver: (e: React.DragEvent, app: App) => void;
  onDragEnd: () => void;
}

export const ReorderList = memo(function ReorderList({ apps, onDragStart, onDragOver, onDragEnd }: ReorderListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {apps.map(app => (
        <Card
          key={app.id}
          className="w-full border-0 shadow-none rounded-none"
          draggable
          onDragStart={() => onDragStart(app)}
          onDragOver={(e) => onDragOver(e, app)}
          onDragEnd={onDragEnd}
        >
          <CardContent className="py-4 px-2">
            <div className="flex items-center gap-4">
              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                <app.icon className="h-5 w-5 text-[#FF0000]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-500">{app.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});