import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  className?: string;
}

export function MetricCard({ title, value, change, positive, className }: MetricCardProps) {
  return (
    <Card className={cn("rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 p-6", className)}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2">
          {title === 'Active Now' && <Users className="w-4 h-4 text-[#FF0000]" />}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-500">
            {title}
          </h3>
        </div>
        <div className="flex flex-1 mt-1 justify-start items-center">
          <div className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {value}
          </div>
          <div className="mt-0 flex items-center gap-1.5">
            {/* {positive ? (
              <ArrowUpIcon className="w-4 h-4 text-emerald-00 dark:text-emerald-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600 dark:text-red-500" />
            )} */}
            <span
              className={cn(
                'text-xs font-medium ms-4',
                positive ? 'text-green-600 dark:text-green-600' : 'text-red-600 dark:text-red-500'
              )}
            >
              {change}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}