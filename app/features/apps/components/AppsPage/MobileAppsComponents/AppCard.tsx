import { type App } from '@/app/features/apps/types';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface AppCardProps {
  app: App;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export function AppCard({ app, onDragStart, onDragOver, onDragEnd }: AppCardProps) {
  return (
    <Card
      className="w-full"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
            <app.icon className="h-5 w-5 text-gray-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{app.name}</h3>
            <p className="text-sm text-gray-500">{app.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}