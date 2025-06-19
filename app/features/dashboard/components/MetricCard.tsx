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
    <Card className={cn("p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#FF0000] hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2">
          {title === 'Active Now' && <Users className="w-4 h-4 text-[#FF0000]" />}
          <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500">
            {title}
          </h3>
        </div>
        <div className="flex-1 mt-4">
          <div className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {value}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {positive ? (
              <ArrowUpIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600 dark:text-red-500" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                positive ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'
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